const express = require("express");
const router = express.Router();
const {
  createBuyerContract,
  generatePDF,
  getBuyerContracts, // ✅ Correct function name
  getBuyerContractById,
  updateBuyerContract,
  deleteBuyerContract,
} = require("../controller/buyercontractcontroller");
router.post("/", createBuyerContract);
router.post("/generate-pdf", generatePDF);
router.get("/", getBuyerContracts);
router.get("/:id", getBuyerContractById);
router.put("/:id", updateBuyerContract);
router.delete("/:id", deleteBuyerContract);

module.exports = router;
