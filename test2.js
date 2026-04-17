require('dotenv').config();
const { handleQuery } = require('./agent/langChainAgent.js');
const fs = require('fs');

async function run() {
  const csv = fs.readFileSync('./data/hackathon_master_data.csv', 'utf8');
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const customDataset = lines.slice(1).filter(l => l.trim()).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i]);
    return obj;
  });

  const res1 = await handleQuery("send reminder to Krishan Distributors", customDataset, []);
  console.log("Response 1:", res1);

  const res2 = await handleQuery("send payment reminder to Nandan Enterprises", customDataset, []);
  console.log("Response 2:", res2);
}

run().catch(console.error);
