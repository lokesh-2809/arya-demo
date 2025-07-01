const express = require("express");
const router = express.Router();
const {
  createBuyer,
  getBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
} = require("../controller/buyercontroller");

router.post("/", createBuyer);
router.get("/", getBuyers);
router.get("/:id", getBuyerById);
router.put("/:id", updateBuyer);
router.delete("/:id", deleteBuyer);

module.exports = router;
