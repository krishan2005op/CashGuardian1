const { getCashPrediction } = require("../services/predictionService");

describe("predictionService", () => {
  test("returns exactly four weekly projections", () => {
    expect(getCashPrediction().projections).toHaveLength(4);
  });

  test("currentBalance matches cash balance ground truth", () => {
    expect(getCashPrediction().currentBalance).toBe(-12500);
  });

  test("projects all three upcoming invoices into future income", () => {
    const prediction = getCashPrediction();
    const baselineIncome = prediction.projections.length * 71313;
    const invoiceContribution = prediction.projections.reduce((sum, week) => sum + week.expectedIncome, 0) - baselineIncome;
    expect(invoiceContribution).toBe(181000);
  });

  test("flags cashRunoutRisk as true because the business starts below the safety buffer", () => {
    const prediction = getCashPrediction();
    expect(prediction.cashRunoutRisk).toBe(true);
    expect(prediction.riskMessage).toContain("₹10,000");
  });

  test("returns the lowest projected point", () => {
    expect(getCashPrediction().lowestPoint).toEqual({
      week: "2026-W17",
      balance: 46750
    });
  });
});
