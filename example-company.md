# Example Company — Arjun Packaging Solutions

This document describes the fictional small business used as the sample dataset in CashGuardian CLI. Read this before running a demo or testing the system — it will help you understand what the data represents and which queries make sense to try.

---

## Company Profile

| Field | Details |
|---|---|
| **Company Name** | Arjun Packaging Solutions Pvt. Ltd. |
| **Location** | Okhla Industrial Area, New Delhi, India |
| **Industry** | B2B Packaging & Supply |
| **Founded** | 2019 |
| **Team Size** | 11 employees |
| **Monthly Revenue (avg)** | ₹2,20,000 – ₹2,80,000 |
| **Monthly Expenses (avg)** | ₹1,60,000 – ₹1,90,000 |

---

## What the Business Does

Arjun Packaging Solutions manufactures and supplies custom corrugated boxes, bubble wrap, and branded packaging materials to small and medium-sized businesses in Delhi NCR. Clients include retail chains, e-commerce sellers, and export firms.

The business operates on a **net-30 payment model** — clients receive goods and are expected to pay within 30 days of invoice issuance.

---

## Revenue Model

- Clients are invoiced after each monthly supply batch is delivered
- Most invoices range from ₹40,000 to ₹1,20,000 depending on order size
- Advance payments are occasionally taken for large custom orders
- The company has 4 active clients in the current period

---

## Clients & Payment Behaviour

| Client | Description | Payment Behaviour |
|---|---|---|
| **Sharma Retail Pvt. Ltd.** | Mid-size retail chain; regular customer | Frequently pays 20–35 days late. Currently has 2 overdue invoices. High risk. |
| **Mehta Exports** | Export trading firm; larger orders | Usually pays on time, but one past invoice was 18 days late. Medium risk. |
| **QuickShip Logistics** | Logistics firm needing packaging for parcels | Reliable payer. Always pays within 5 days of due date. Low risk. |
| **BlueStar Ecom Pvt. Ltd.** | E-commerce seller; recent new client | Only 1 invoice raised so far. Currently pending. Risk unknown. |

---

## Monthly Expenses

| Category | Approx. Monthly Cost |
|---|---|
| Office & Warehouse Rent | ₹22,000 |
| Salaries (11 staff) | ₹88,000 |
| Raw Material (paper, adhesive, etc.) | ₹38,000 |
| Electricity & Utilities | ₹7,500 |
| Logistics & Delivery | ₹12,000 |
| Software & Subscriptions | ₹2,200 |
| Miscellaneous | ₹5,000 |
| **Total (approx.)** | **₹1,74,700** |

---

## Current Financial Situation

As of April 2025, Arjun Packaging Solutions is in a **moderately stressed cash position**:

- **Current Cash Balance:** ₹63,400 (lower than usual due to delayed client payments)
- **Total Outstanding Receivables:** ₹1,87,000 across 3 unpaid invoices
- **Upcoming Expenses (next 30 days):** ~₹1,74,700 (full monthly cycle)
- **Projected Cash After 30 Days:** ₹75,700 (if all receivables are collected on time)

The main concern is **Sharma Retail**, who owes ₹1,25,000 across two overdue invoices and has a history of paying late. If they delay further, Arjun may struggle to cover the next month's salaries.

---

## Key Problems (What the CLI Can Help Detect)

1. **Overdue Invoices** — Sharma Retail's invoices (INV-001 and INV-002) are overdue by 14 and 28 days respectively
2. **Late Payment Pattern** — Sharma Retail has paid late on every invoice in the last 6 months
3. **Low Cash Warning** — Current balance of ₹63,400 is near the risk threshold for covering monthly expenses
4. **Uncertain Inflow** — BlueStar Ecom's first invoice is pending; no payment history exists to gauge reliability

---

## How to Interact With This Company Using the CLI

Once you start CashGuardian CLI (`node index.js`), you are interacting with Arjun Packaging Solutions' financial data.

Think of yourself as the business owner or financial manager asking questions about the company.

---

## Suggested Demo Flow

### Step 1: Get a financial overview
```
> What is my current cash balance?
```
**Expected:** Shows ₹63,400 with a note that it's below the safe threshold.

---

### Step 2: See the full cash flow summary
```
> Give me a cash flow summary
```
**Expected:** Breakdown of total income received, total expenses paid, and net cash position over the tracked period.

---

### Step 3: Find overdue invoices
```
> Show me all overdue invoices
```
**Expected:** Lists INV-001 and INV-002 (both from Sharma Retail), showing amount due and days overdue.

---

### Step 4: Check which clients are risky
```
> Which clients are at risk of not paying?
```
**Expected:** Flags Sharma Retail as high risk due to repeated late payment history. Mehta Exports flagged as medium risk.

---

### Step 5: Predict future cash position
```
> What will my cash look like in the next 30 days?
```
**Expected:** Week-by-week projection showing expected inflows (if clients pay on time) and outflows (recurring expenses).

---

### Step 6: Check expense breakdown
```
> What am I spending money on?
```
**Expected:** Grouped expense summary by category (Rent, Salaries, Raw Materials, etc.)

---

### Step 7: Send a payment reminder
```
> Send a payment reminder to Sharma Retail
```
**Expected:** Confirmation that a reminder email has been sent to `accounts@sharmaretail.com` with overdue invoice details.

---

## Notes for Testers

- All queries are **case-insensitive**
- Client names do **not** need to be exact — "Sharma" will match "Sharma Retail Pvt. Ltd."
- If you try to send a reminder to a client with no overdue invoices, the system will tell you so and will not send an email
- Type `help` at any time to see the list of supported query types
- Type `exit` to quit the CLI
