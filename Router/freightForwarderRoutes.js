const express = require("express");
const router = express.Router();
const freightController = require("../controller/freightForwarderController");

router.get("/", freightController.getFreightForwarders); // ✅ corrected
router.post("/", freightController.createFreightForwarder);
router.get("/:id", freightController.getFreightForwarderById);
router.put("/:id", freightController.updateFreightForwarder);
router.delete("/:id", freightController.deleteFreightForwarder);

module.exports = router;
