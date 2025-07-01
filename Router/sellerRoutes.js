const express = require("express");
const router = express.Router();

const {
  createSeller,
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller
} = require("../controller/sellercontroller"); // ⛔ No need to add `.js` in CommonJS

router.post("/", createSeller);
router.get("/", getSellers);
router.get("/:id", getSellerById);
router.put("/:id", updateSeller);
router.delete("/:id", deleteSeller);

module.exports = router;
