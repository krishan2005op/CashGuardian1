const { handleQuery } = require("../agent/queryAgent");
require("dotenv").config();

async function runTests() {
  console.log("--- TEST 1: What makes up total sales? ---");
  const salesRes = await handleQuery("What makes up total sales?");
  console.log(salesRes);
  console.log("\n");

  console.log("--- TEST 2: Show the breakdown of costs by department ---");
  const costsRes = await handleQuery("Show the breakdown of costs by department");
  console.log(costsRes);
}

runTests();
