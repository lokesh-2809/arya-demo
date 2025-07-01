const express = require("express");
const router = express.Router();
const portController = require("../controller/portController");

router.post("/", portController.createPort);
router.get("/", portController.getAllPorts);
router.get("/:id", portController.getPortById);
router.put("/:id", portController.updatePort);
router.delete("/:id", portController.deletePort);

module.exports = router;
