const express = require("express");
const router = express.Router();
const containerCtrl = require("../controller/containerController");

router.get("/", containerCtrl.getContainers);
router.post("/", containerCtrl.createContainer);
router.get("/:id", containerCtrl.getContainerById);
router.put("/:id", containerCtrl.updateContainer);
router.delete("/:id", containerCtrl.deleteContainer);

module.exports = router;
