const express = require("express");
const router = express.Router();
const countryCtrl = require("../controller/countrycontroller");

router.post("/", countryCtrl.createCountry);
router.get("/", countryCtrl.getCountries);
router.get("/:id", countryCtrl.getCountryById);
router.put("/:id", countryCtrl.updateCountry);
router.delete("/:id", countryCtrl.deleteCountry);

module.exports = router;
