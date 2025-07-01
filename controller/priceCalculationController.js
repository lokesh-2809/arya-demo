const PriceCalculation = require('../models/PriceCalculator');
const { calculatePriceDetails } = require('../utils/priceCalculationUtil');

exports.priceCalculation = async (req, res) => {
  const {
    product,
    numOfContainers,
    tonnes,
    freight,
    dctPrice,
    usdSellPrice,
    date,
    exchangeRate,
    commission,
    status
  } = req.body;

  try {
    if (!usdSellPrice || !exchangeRate || !commission) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const priceData = await calculatePriceDetails({
      product,
      numOfContainers,
      tonnes,
      freight,
      dctPrice,
      usdSellPrice,
      exchangeRate,
      commission,
      status
    });

    const calculated = new PriceCalculation({
      ...priceData,
      date 
    });

    await calculated.save();

    res.status(201).json({
      message: 'Price calculation completed and saved.',
      data: calculated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
