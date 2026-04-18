const { handleQuery } = require("../agent/langChainAgent");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

async function runTest(query, label) {
  console.log(`\n--- TEST: ${label} ---`);
  console.log(`Query: "${query}"`);
  try {
    const showcaseData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/showcase_final.json'), 'utf8'));
    const res = await handleQuery(query, showcaseData, []);
    console.log("Response:", res.content);
    if (res.duel) console.log("Duel Data:", JSON.stringify(res.duel));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function debug() {
  // Test 1: Anomaly Detection
  await runTest("Are there any unusual patterns in my spending?", "Anomaly Detection");

  // Test 2: Brittle Comparison
  await runTest("10. Period Analysis: Compare this month versus last month.", "Robust Comparison");
  
  // Test 3: Overdue Duplication (Manual check of response text)
  await runTest("Show me all overdue invoices", "Deduplication Check");
}

debug();
