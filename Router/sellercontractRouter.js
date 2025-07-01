const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  createSellerContract,
  getAllSellerContracts,
  getSellerContractById,
  deleteSellerContract
} = require("../controller/sellercontractController");

router.post("/", upload.single("uploadDocument"), createSellerContract);
router.get("/", getAllSellerContracts);
router.get("/:id", getSellerContractById);
router.delete("/:id", deleteSellerContract);

module.exports = router;
