# Methodology — How CashGuardian CLI Works

This document explains the internal logic and design decisions behind CashGuardian CLI. It is written for developers and technical evaluators who want to understand how the system actually functions — not just what it claims to do.

---

## 1. System Design Philosophy

CashGuardian CLI is designed around one core principle: **do simple things correctly and transparently**.

Rather than over-engineering with machine learning or complex APIs, the system uses:

- Structured JSON data to simulate real financial records
- Clear, deterministic rule-based logic for all calculations
- A simple intent-matching agent (no LLM required) to interpret user queries
- Direct function calls from the agent to focused service modules

Every result the system produces can be traced back to a specific calculation over specific data rows. There are no black boxes.

---

## 2. Data Flow — End to End

```
User types a query
        ↓
CLI captures input (readline)
        ↓
Query Agent parses intent from input text
        ↓
Agent calls the appropriate service function
        ↓
Service reads from JSON data files
        ↓
Service performs calculations / filtering
        ↓
Result is returned to the agent
        ↓
Formatter prints structured output to terminal
```

Each step is a discrete function with clear inputs and outputs. No step mixes responsibilities (e.g., a service never prints to the terminal directly).

---

## 3. How Cash Flow Is Calculated

Cash flow is computed inside `cashFlowService.js`.

### Step 1: Load transactions

All records from `data/transactions.json` are loaded. Each record is either an `income` or `expense` type.

### Step 2: Sum by type

```
totalIncome  = sum of all transactions where type === "income"
totalExpense = sum of all transactions where type === "expense"
netCashFlow  = totalIncome - totalExpense
```

### Step 3: Group by category (for breakdown)

Expenses are grouped by their `category` field (e.g., Rent, Salaries, Utilities, Vendor Payments) so the user can see where money is going.

### Output

The service returns an object with `totalIncome`, `totalExpense`, `netCashFlow`, and a `breakdown` array. The formatter renders this as a readable table in the terminal.

---

## 4. How Predictions Are Generated

The prediction engine lives in `predictionService.js`. It uses a **forward projection model** — not machine learning.

### Logic

1. Start with the current net cash balance (from `cashFlowService`)
2. Load all invoices that are **not yet paid** but have a **future due date** → these are expected inflows
3. Load all recurring expenses from transactions history → project them forward as expected outflows
4. Walk forward day by day (or week by week) for 30 days, adding inflows and subtracting outflows on their expected dates

### Output

A projected cash balance for each upcoming week, e.g.:

```
Week 1: ₹1,84,000 (Invoice from Mehta Exports due)
Week 2: ₹1,61,000 (Rent + Salaries due)
Week 3: ₹1,61,000 (No major events)
Week 4: ₹1,38,000 (Vendor payment due)
```

### Assumptions

- Recurring expenses repeat on the same date each month
- Unpaid invoices will be paid on their due date (optimistic scenario)
- No new unexpected income or expenses are assumed

This is clearly a best-case projection. The system flags this assumption in the output.

---

## 5. How Risk Detection Works

Risk detection is handled by `riskService.js`. It uses three rule-based checks:

### Rule 1: Overdue Invoice Flag

Any invoice where:
- `status !== "paid"` AND
- `dueDate < today`

is flagged as overdue.

### Rule 2: Repeated Late Payer

A client is flagged as a "payment risk" if:
- They have **2 or more invoices** in the dataset that were paid **more than 15 days after the due date**

This is computed by comparing `paymentReceivedDate` vs `dueDate` across all historical invoices for that client.

### Rule 3: Low Cash Warning

If the current net cash balance falls below a configured threshold (default: ₹50,000), a warning is raised:

```
⚠️  WARNING: Cash balance is critically low (₹38,200). You may be unable to cover upcoming expenses.
```

### Output

Each risk alert is returned with a `severity` level (`high`, `medium`, `low`), an `explanation`, and a suggested `action`.

---

## 6. How Email Reminders Are Triggered

Email functionality is in `emailService.js`, powered by Nodemailer.

### Trigger Path

1. User types: `Send a payment reminder to [Client Name]`
2. The agent identifies the intent as `ACTION_SEND_REMINDER`
3. Agent looks up the client name in `invoices.json` to find all overdue invoices
4. Agent passes invoice details to `emailService.sendReminder()`
5. Nodemailer sends the email using SMTP credentials from `.env`

### Email Content

The reminder email includes:
- Invoice number(s)
- Amount(s) due
- Days overdue
- A polite but firm message asking for prompt payment

### Safety Check

If no overdue invoices are found for the specified client, the system does **not** send an email and instead informs the user:

```
No overdue invoices found for "Mehta Exports". No email sent.
```

---

## 7. How the CLI Loop Works

The entry point `index.js` runs an infinite `readline` loop:

```javascript
rl.on('line', async (input) => {
  const response = await agent.handle(input.trim());
  console.log(response);
});
```

The loop continues until the user types `exit` or `quit`. There is no session state — each query is processed independently. This keeps the architecture simple and each interaction self-contained.

---

## 8. Why Rule-Based Logic (Not ML)

For a hackathon project operating on simulated data with a small dataset:

- Rules are **transparent** — every output can be explained
- Rules are **fast** — no model loading, no API calls
- Rules are **reliable** — no hallucinations, no false confidence
- Rules are **honest** — they don't pretend to know more than they do

The trade-off is that rules don't scale or self-improve. That limitation is documented clearly in [limitations.md](./limitations.md).
