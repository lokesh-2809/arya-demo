// routes/router.js
const express = require('express');
const router = express.Router();
const priceCalculatorController = require('../controller/priceCalculationController');
// Auth routes
router.post('/price-calculation', priceCalculatorController.priceCalculation);

module.exports = router;
