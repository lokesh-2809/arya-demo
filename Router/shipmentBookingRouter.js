const express = require('express');
const router = express.Router();

const shipmentBooking = require('../controller/shipmentbookingcontroller');

router.post("/", shipmentBooking.createShipmentBooking);
router.get("/", shipmentBooking.getShipment);
router.get("/:id", shipmentBooking.getShipmentById);
router.put("/:id", shipmentBooking.updateShipment);
router.delete("/:id", shipmentBooking.deleteShipment);

module.exports = router;