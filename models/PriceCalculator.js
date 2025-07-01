const mongoose = require('mongoose');

const priceCalculatorSchema = new mongoose.Schema({
    product: { type: String },
    numOfContainers: { type: Number },
    tonnes: { type: Number },
    freight: { type: Number },
    dctPrice: { type: Number },
    usdSellPrice: { type: Number },
    date: { type: Date },
    exchangeRate: { type: Number },
    commission: { type: Number },
    audCommission: { type: Number },
    totalAudBaseRate: { type: Number },
    totalUsdBaseRate: { type: Number },
    totalUsdCustomRate: { type: Number },
    totalExpensesUsd: { type: Number },
    totalPerContainerUsd: { type: Number },
    totalExpensesPerTonUsd: { type: Number },
    dctPerTonUsd: { type: Number },
    totalCostPerTonUsd: { type: Number },
    profitPerTon: { type: Number },
    profitPerShipmentUsd: { type: Number },
    profitPerShipmentAud: { type: Number },
    commissionToBePaid: { type: Number },
    profitAfterCommissionUsd: { type: Number },
    profitAfterCommissionAud: { type: Number },
    profitPerTonAfterCommissionUsd: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('PriceCalculation', priceCalculatorSchema);
