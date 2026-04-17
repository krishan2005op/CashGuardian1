require('dotenv').config();
const { sendPaymentReminder } = require('./services/emailService.js');
const fs = require('fs');

async function testEmail() {
  console.log("Testing email functionality...");
  
  // Create dummy invoice
  const invoiceData = {
    client: 'Nandan Enterprises',
    amount: 50000,
    daysOverdue: 10,
    invoiceId: 'TEST-123'
  };

  // Load custom dataset
  const csv = fs.readFileSync('./data/hackathon_master_data.csv', 'utf8');
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const customDataset = lines.slice(1).filter(l => l.trim()).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i]);
    return obj;
  });

  console.log("Mock data loaded. Calling sendPaymentReminder...");
  const result = await sendPaymentReminder(invoiceData, customDataset);
  
  console.log("\n--- RESULT ---");
  console.log(JSON.stringify(result, null, 2));
}

testEmail().catch(console.error);
