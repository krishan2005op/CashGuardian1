const invoices = require("../data/invoices.json");
const { getCashBalance } = require("./cashFlowService");

/**
 * Returns a UTC date at midnight.
 * @param {string} dateStr - ISO date string.
 * @returns {Date} Parsed date.
 */
function parseUtcDate(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`);
}

/**
 * Builds a simple week label from a UTC date.
 * @param {Date} date - Date to label.
 * @returns {string} Year-week label.
 */
function getWeekLabel(date) {
  const year = date.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((date - start) / 86400000) + 1;
  const weekNumber = Math.ceil(dayOfYear / 7);
  return `${year}-W${String(weekNumber).padStart(2, "0")}`;
}

/**
 * Returns weekly income and expense totals for the last 8 rolling weeks.
 * @returns {Array<{ income: number, expenses: number }>} Rolling week totals.
 */
function getLastEightWeeks() {
  const transactions = require("../data/transactions.json");
  const latestDate = transactions.reduce((latest, transaction) => {
    const transactionDate = parseUtcDate(transaction.date);
    return transactionDate > latest ? transactionDate : latest;
  }, parseUtcDate(transactions[0].date));

  const buckets = Array.from({ length: 8 }, () => ({ income: 0, expenses: 0 }));

  transactions.forEach((transaction) => {
    const transactionDate = parseUtcDate(transaction.date);
    const dayDiff = Math.floor((latestDate - transactionDate) / 86400000);
    const bucketIndex = 7 - Math.floor(dayDiff / 7);

    if (bucketIndex < 0 || bucketIndex > 7) {
      return;
    }

    if (transaction.type === "income") {
      buckets[bucketIndex].income += transaction.amount;
    } else {
      buckets[bucketIndex].expenses += transaction.amount;
    }
  });

  return buckets;
}

/**
 * Projects cash position for next 30 days.
 * @returns {{
 *   currentBalance: number,
 *   projections: Array<{ week: string, expectedIncome: number, expectedExpenses: number, projectedBalance: number }>,
 *   lowestPoint: { week: string, balance: number },
 *   cashRunoutRisk: boolean,
 *   riskMessage: string | null
 * }}
 */
function getCashPrediction() {
  const transactions = require("../data/transactions.json");
  const currentBalance = getCashBalance().netBalance;
  const latestDate = transactions.reduce((latest, transaction) => {
    const transactionDate = parseUtcDate(transaction.date);
    return transactionDate > latest ? transactionDate : latest;
  }, parseUtcDate(transactions[0].date));
  const lastEightWeeks = getLastEightWeeks();
  const averageIncome = lastEightWeeks.reduce((sum, week) => sum + week.income, 0) / lastEightWeeks.length;
  const averageExpenses = lastEightWeeks.reduce((sum, week) => sum + week.expenses, 0) / lastEightWeeks.length;
  const upcomingInvoices = invoices.filter((invoice) => invoice.status === "unpaid");
  let runningBalance = currentBalance;

  const projections = Array.from({ length: 4 }, (_, index) => {
    const weekStart = new Date(latestDate);
    weekStart.setUTCDate(latestDate.getUTCDate() + (index * 7) + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

    const invoiceIncome = upcomingInvoices
      .filter((invoice) => {
        const dueDate = parseUtcDate(invoice.dueDate);
        return dueDate >= weekStart && dueDate <= weekEnd;
      })
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    const expectedIncome = Math.round(averageIncome + invoiceIncome);
    const expectedExpenses = Math.round(averageExpenses);
    runningBalance += expectedIncome - expectedExpenses;

    return {
      week: getWeekLabel(weekEnd),
      expectedIncome,
      expectedExpenses,
      projectedBalance: runningBalance
    };
  });

  const lowestPoint = projections.reduce((lowest, projection) =>
    projection.projectedBalance < lowest.balance
      ? { week: projection.week, balance: projection.projectedBalance }
      : lowest
  , { week: projections[0].week, balance: projections[0].projectedBalance });

  const cashRunoutRisk = currentBalance < 10000 || projections.some((projection) => projection.projectedBalance < 10000);

  return {
    currentBalance,
    projections,
    lowestPoint,
    cashRunoutRisk,
    riskMessage: cashRunoutRisk
      ? "Cash runway is at risk because the business starts below the ₹10,000 safety buffer."
      : null
  };
}

module.exports = {
  getCashPrediction,
  getWeekLabel
};
