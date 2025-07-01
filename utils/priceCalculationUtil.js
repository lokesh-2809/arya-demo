// utils/priceCalculatorUtil.js

const fetchProductExpenses = async (product, status) => {
  // Replace this mock with your real DB/API logic
  return [
    { elements: [null, null, { value: "100" }, { value: "MUL(Tonnes)" }] },
    { elements: [null, null, { value: "50" }, { value: "" }] }
  ];
};

const calculatePriceDetails = async ({
  product,
  numOfContainers,
  tonnes,
  freight,
  dctPrice,
  usdSellPrice,
  exchangeRate,
  commission,
  status
}) => {
  const commissionVal = +(commission * usdSellPrice / 100).toFixed(2);
  const searchProduct = await fetchProductExpenses(product, status);

  let totalAudBaseRate = 0;
  let totalAudCustomRate = 0;

  if (searchProduct?.length && product) {
    for (const item of searchProduct) {
      const rate = parseFloat(item.elements[2].value);
      const label = item.elements[3]?.value;

      totalAudBaseRate += rate;

      let customRate = rate;
      if (label === 'MUL(Tonnes)') {
        customRate = rate * tonnes;
      }
      totalAudCustomRate += customRate;
    }
  }

  const totalUsdBaseRate = +(exchangeRate * totalAudBaseRate).toFixed(2);
  const totalUsdCustomRate = +(exchangeRate * totalAudCustomRate).toFixed(2);
  const oceanFreightCustomRate = +(numOfContainers * freight).toFixed(2);
  const totalExpensesUsd = +(oceanFreightCustomRate + totalUsdCustomRate).toFixed(2);
  const totalPerContainerUsd = +(totalExpensesUsd / numOfContainers).toFixed(2);
  const totalExpensesPerTonUsd = +(totalExpensesUsd / tonnes).toFixed(2);
  const dctPerTonUsd = +(exchangeRate * dctPrice).toFixed(2);
  const totalCostPerTonUsd = +(totalExpensesPerTonUsd + dctPerTonUsd).toFixed(2);
  const profitPerTon = +(usdSellPrice - totalCostPerTonUsd).toFixed(2);
  const profitPerShipmentUsd = +(profitPerTon * tonnes).toFixed(2);
  const profitPerShipmentAud = +(profitPerShipmentUsd / exchangeRate).toFixed(2);
  const commissionToBePaid = +(commissionVal * tonnes).toFixed(2);
  const profitAfterCommissionUsd = +(profitPerShipmentUsd - commissionToBePaid).toFixed(2);
  const profitAfterCommissionAud = +(profitAfterCommissionUsd / exchangeRate).toFixed(2);
  const profitPerTonAfterCommissionUsd = +(profitAfterCommissionUsd / tonnes).toFixed(2);

  return {
    product,
    numOfContainers,
    tonnes,
    freight,
    dctPrice,
    usdSellPrice,
    exchangeRate,
    commission,
    audCommission: commissionVal,
    totalAudBaseRate,
    totalUsdBaseRate,
    totalUsdCustomRate,
    totalExpensesUsd,
    totalPerContainerUsd,
    totalExpensesPerTonUsd,
    dctPerTonUsd,
    totalCostPerTonUsd,
    profitPerTon,
    profitPerShipmentUsd,
    profitPerShipmentAud,
    commissionToBePaid,
    profitAfterCommissionUsd,
    profitAfterCommissionAud,
    profitPerTonAfterCommissionUsd
  };
};

module.exports = { calculatePriceDetails };
