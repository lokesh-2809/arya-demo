const express = require("express");
const router = express.Router();
const ctrl = require("../controller/uniqueIdController");

router.post("/", ctrl.createUniqueId);
router.get("/", ctrl.getUniqueIds);
router.get("/:id", ctrl.getUniqueIdById);
router.put("/:id", ctrl.updateUniqueId);
router.delete("/:id", ctrl.deleteUniqueId);

module.exports = router;
