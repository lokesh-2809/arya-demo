const express = require("express");
const router = express.Router();
const farmerCtrl = require("../controller/farmercontroller");



// Get all farmers with pagination, filters, global search
router.get("/", farmerCtrl.getFarmers);

// Create new farmer
router.post("/", farmerCtrl.createFarmer);

// Get farmer by ID
router.get("/:id", farmerCtrl.getFarmerById);

// Update farmer
router.put("/:id", farmerCtrl.updateFarmer);

// Delete farmer
router.delete("/:id", farmerCtrl.deleteFarmer);

module.exports = router;
