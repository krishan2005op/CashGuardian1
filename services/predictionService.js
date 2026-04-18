const { getCashBalance, summarizeTransactions, getTransactionsInRange, getLatestTransactionDate } = require("./cashFlowService");
const { getUpcomingDue } = require("./invoiceService");

/**
 * Calculates a data-driven 30-day cash forecast.
 * @param {Array<Object>|null} dataset - Optional custom dataset.
 * @returns {Object} Forecast components and final projection.
 */
function calculate30DayForecast(dataset = null) {
  const balance = getCashBalance(dataset);
  const latestDate = getLatestTransactionDate(dataset);
  
  // 1. Calculate Burn Rate (Last 90 days)
  const windowDays = 90;
  const from = new Date(latestDate);
  from.setUTCDate(from.getUTCDate() - (windowDays - 1));
  
  const history = getTransactionsInRange(from, latestDate, dataset);
  const totals = summarizeTransactions(history);
  
  const avgDailyRevenue = totals.income / windowDays;
  const avgDailyBurn = totals.expenses / windowDays;
  
  // 2. Factored Upcoming Receipts (Next 30 days)
  const upcomingInvoices = getUpcomingDue(30);
  const upcomingTotal = upcomingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // 3. Projections
  const projectedRevenue = avgDailyRevenue * 30;
  const projectedBurn = avgDailyBurn * 30;
  const finalBalance = balance.netBalance + projectedRevenue + upcomingTotal - projectedBurn;

  return {
    openingBalance: balance.netBalance,
    avgDailyRevenue: Math.round(avgDailyRevenue),
    avgDailyBurn: Math.round(avgDailyBurn),
    projectedRevenue: Math.round(projectedRevenue),
    projectedBurn: Math.round(projectedBurn),
    upcomingTotal: Math.round(upcomingTotal),
    finalBalance: Math.round(finalBalance),
    daysOut: 30,
    reasoning: `Based on your last ${windowDays} days, your average daily burn is ₹${Math.round(avgDailyBurn).toLocaleString('en-IN')}. ` +
               `Over the next 30 days, we expect ₹${Math.round(projectedRevenue).toLocaleString('en-IN')} in run-rate revenue plus ₹${upcomingTotal.toLocaleString('en-IN')} from specific upcoming invoices.`
  };
}

module.exports = {
  calculate30DayForecast
};
