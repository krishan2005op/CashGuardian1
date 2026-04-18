const fs = require('fs');
const path = require('path');

const startDate = new Date('2026-01-15');
const endDate = new Date('2026-04-19');
const csvFile = path.join(__dirname, '../data/test_13_week_dataset.csv');

const clients = [
  { name: 'Alpha Retail', email: 'nandan.nv358@gmail.com' },
  { name: 'Beta Logistics', email: 'krishanmalhotra2005@gmail.com' },
  { name: 'Gamma Services', email: 'krishanmalhotra2005@gmail.com' },
  { name: 'Delta Manufacturing', email: 'nverma_be23@thapar.edu' },
  { name: 'Sigma Traders', email: 'nandan.nv358@gmail.com' }
];

const categories = ['sales', 'consulting', 'rent', 'salaries', 'logistics', 'utilities', 'marketing', 'miscellaneous'];

const rows = [];
rows.push('date,type,amount,category,description,client,status,dueDate,issueDate,email');

let current = new Date(startDate);
while (current <= endDate) {
  const dateStr = current.toISOString().slice(0, 10);
  
  // 1. Daily Sales
  const salesCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < salesCount; i++) {
    const amount = Math.floor(Math.random() * 15000) + 5000;
    const clientObj = clients[Math.floor(Math.random() * clients.length)];
    rows.push(`${dateStr},income,${amount},sales,Daily Retail Settlement,${clientObj.name},paid,${dateStr},${dateStr},${clientObj.email}`);
  }

  // 2. Daily Small Expenses
  const expAmount = Math.floor(Math.random() * 3000) + 500;
  rows.push(`${dateStr},expense,${expAmount},utilities,Daily Operational Expense,,paid,${dateStr},${dateStr},`);

  // 3. Weekly Rent (Mondays)
  if (current.getUTCDay() === 1) {
    rows.push(`${dateStr},expense,25000,rent,Office Rent Payment,,paid,${dateStr},${dateStr},`);
  }

  // 4. Monthly Salaries (1st of month)
  if (current.getUTCDate() === 1) {
    rows.push(`${dateStr},expense,120000,salaries,Staff Salaries Deployment,,paid,${dateStr},${dateStr},`);
  }

  // 5. Invoices (Mixed Status)
  if (current.getUTCDay() === 3) { // Wednesdays
    const clientIdx = Math.floor(Math.random() * clients.length);
    const clientObj = clients[clientIdx];
    const amount = Math.floor(Math.random() * 50000) + 20000;
    const due = new Date(current);
    due.setUTCDate(due.getUTCDate() + 15);
    const dueStr = due.toISOString().slice(0, 10);
    
    let status = 'paid';
    if (current > new Date('2026-04-01')) status = 'unpaid';
    if (due < new Date()) {
        status = Math.random() > 0.5 ? 'overdue' : 'paid';
    }

    rows.push(`${dateStr},income,${amount},consulting,Invoice ${rows.length},${clientObj.name},${status},${dueStr},${dateStr},${clientObj.email}`);
  }

  // 6. Anomalies
  const weekNum = Math.ceil((current.getTime() - new Date(current.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  if (weekNum === 8 && current.getUTCDay() === 5) {
      rows.push(`${dateStr},expense,85000,logistics,Surge Logistics - Emergency Shipment,,paid,${dateStr},${dateStr},`);
  }

  current.setUTCDate(current.getUTCDate() + 1);
}

fs.writeFileSync(csvFile, rows.join('\n'));
console.log(`Generated ${rows.length - 1} records with emails in ${csvFile}`);
