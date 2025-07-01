const express = require("express");
const router = express.Router();
const shipperController = require("../controller/shippercontroller");

router.post("/", shipperController.createShipper);
router.get("/", shipperController.getShippers);
router.get("/:id", shipperController.getShipperById);
router.put("/:id", shipperController.updateShipper);
router.delete("/:id", shipperController.deleteShipper);

module.exports = router;
