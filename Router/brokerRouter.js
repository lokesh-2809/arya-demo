const express = require('express');
const router = express.Router();
const brokerController = require('../controller/brokercontroller');

router.get('/', brokerController.getBrokers);
router.post('/', brokerController.createBroker);
router.get('/:id', brokerController.getBrokerById);
router.put('/:id', brokerController.updateBroker);
router.delete('/:id', brokerController.deleteBroker);
router.post('/delete-multiple', brokerController.deleteMultipleBrokers);
module.exports = router;
