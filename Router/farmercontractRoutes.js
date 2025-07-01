const express = require("express");
const router = express.Router();
const {
  createFarmerContract,
  getFarmerContracts,
  getFarmerContractById,
  updateFarmerContract,
  deleteFarmerContract,
} = require("../controller/farmerContractController");

router.post("/", createFarmerContract);
router.get("/", getFarmerContracts);
router.get("/:id", getFarmerContractById);
router.put("/:id", updateFarmerContract);
router.delete("/:id", deleteFarmerContract);

module.exports = router;