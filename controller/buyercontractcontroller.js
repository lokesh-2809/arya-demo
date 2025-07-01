// backend/controllers/buyerContractController.js
const BuyerContract = require("../models/buyercontract");


const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIA4MI2J5ED2IPQUOWT",
    secretAccessKey: "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",
  },
});
const BUCKET_NAME = "clapnet.file.upload";


// Create Buyer Contract
exports.createBuyerContract = async (req, res) => {
  try {
    const contract = new BuyerContract(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All with Filters, Search, Pagination
exports.getBuyerContracts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;
    const query = {
      $and: [
        Object.entries(filters).map(([key, val]) => ({ [key]: new RegExp(val, "i") })),
        search ? {
          $or: [
            { buyerName: new RegExp(search, "i") },
            { buyerContractId: new RegExp(search, "i") },
            { phone: new RegExp(search, "i") },
          ]
        } : {},
      ].flat(),
    };

    const total = await BuyerContract.countDocuments(query);
    const contracts = await BuyerContract.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ total, contracts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getBuyerContractById = async (req, res) => {
  try {
    const contract = await BuyerContract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "Not found" });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateBuyerContract = async (req, res) => {
  try {
    const contract = await BuyerContract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteBuyerContract = async (req, res) => {
  try {
    await BuyerContract.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


function injectDataIntoTemplate(html, data) {
  return html.replace(/{{(.*?)}}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? value : "";
  });
}

exports.generatePDF = async (req, res) => {
  try {
    const data = req.body;
    console.log("🔧 Generating PDF for:", data.buyername);

    // Load and inject HTML template
    const templatePath = path.join(__dirname, "../public/html_templates/buyerContract.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = injectDataIntoTemplate(html, data);

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Generate a sanitized filename
    const timestamp = Date.now();
    const cleanBuyerName = (data.buyername || "buyer").replace(/\s+/g, "_");
    const filename = `arya_pulses/${timestamp}-${cleanBuyerName}.pdf`;

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      ACL: "public-read",
    };

    await s3.send(new PutObjectCommand(uploadParams));
    console.log(`✅ Uploaded PDF to S3: ${filename}`);

    // Build public S3 URL
    const fileUrl = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${filename}`;

    res.status(200).json({
      message: "PDF generated and uploaded successfully",
      url: fileUrl,
      filename,
    });

  } catch (error) {
    console.error("❌ PDF generation/upload failed:", error);
    res.status(500).json({ error: "Failed to generate or upload PDF" });
  }
};
