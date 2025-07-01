const express = require("express");
const router = express.Router();
const packerController = require("../controller/packercontroller");

router.get("/", packerController.getAllPackers); // FIXED name
router.post("/", packerController.createPacker);
router.get("/:id", packerController.getPackerById);
router.put("/:id", packerController.updatePacker);
router.delete("/:id", packerController.deletePacker);

module.exports = router;
