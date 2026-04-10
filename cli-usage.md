# CLI Usage Guide — CashGuardian CLI

This document covers all supported commands, example inputs, expected outputs, and error handling behaviour. Use this as a reference when testing or demonstrating the system.

---

## Starting the CLI

```bash
node index.js
```

Output:

```
══════════════════════════════════════════
  💼  CashGuardian CLI  |  v1.0.0
  Small Business Financial Assistant
══════════════════════════════════════════
Company loaded: Arjun Packaging Solutions

Type a question or command. Type "help" to see options.

>
```

---

## Command Reference

---

### 1. `help`

**Purpose:** List all supported query types.

**Input:**
```
> help
```

**Output:**
```
Here's what I can help you with:

  📊  Financial Queries
  ─────────────────────────────────────────
  • "What is my current cash balance?"
  • "Give me a cash flow summary"
  • "Show me all overdue invoices"
  • "What am I spending money on?"
  • "Which clients are at risk of not paying?"
  • "What will my cash look like in 30 days?"

  ✉️   Actions
  ─────────────────────────────────────────
  • "Send a payment reminder to [Client Name]"

  ⚙️   System
  ─────────────────────────────────────────
  • "help"  — show this message
  • "exit"  — quit the application
```

---

### 2. Cash Balance

**Purpose:** Show the current net cash position.

**Example Inputs:**
```
> What is my current cash balance?
> How much cash do I have?
> Current balance
```

**Example Output:**
```
💰  Current Cash Balance
─────────────────────────────────────────
  Balance:   ₹63,400
  As of:     10 Apr 2025

⚠️  WARNING: Your balance is below the recommended safety threshold of ₹75,000.
    You may have limited buffer to cover upcoming monthly expenses (~₹1,74,700).
```

---

### 3. Cash Flow Summary

**Purpose:** Show total income, total expenses, and net cash flow for the tracked period.

**Example Inputs:**
```
> Give me a cash flow summary
> Show income and expenses
> What's my cash flow?
```

**Example Output:**
```
📈  Cash Flow Summary  (Nov 2024 – Apr 2025)
─────────────────────────────────────────────────
  Total Income Received:    ₹12,35,000
  Total Expenses Paid:      ₹11,71,600
  ─────────────────────────────────────
  Net Cash Flow:            ₹63,400

  Expense Breakdown:
  ┌──────────────────────┬────────────┬────────┐
  │ Category             │ Amount     │ Share  │
  ├──────────────────────┼────────────┼────────┤
  │ Salaries             │ ₹5,28,000  │ 45.1%  │
  │ Raw Materials        │ ₹2,28,000  │ 19.5%  │
  │ Rent                 │ ₹1,32,000  │ 11.3%  │
  │ Logistics            │ ₹72,000    │  6.2%  │
  │ Utilities            │ ₹45,000    │  3.8%  │
  │ Software             │ ₹13,200    │  1.1%  │
  │ Miscellaneous        │ ₹30,000    │  2.6%  │
  └──────────────────────┴────────────┴────────┘
```

---

### 4. Overdue Invoices

**Purpose:** List all unpaid invoices that are past their due date.

**Example Inputs:**
```
> Show me all overdue invoices
> Which invoices are overdue?
> Late invoices
```

**Example Output:**
```
🔴  Overdue Invoices  (3 found)
─────────────────────────────────────────────────────────────────────
  Invoice     Client                   Amount       Due Date     Days Late
  ─────────────────────────────────────────────────────────────────────
  INV-001     Sharma Retail Pvt. Ltd.  ₹62,000      12 Mar 2025  29 days
  INV-002     Sharma Retail Pvt. Ltd.  ₹63,000      27 Mar 2025  14 days
  INV-007     Mehta Exports            ₹85,000      01 Apr 2025  9 days
  ─────────────────────────────────────────────────────────────────────
  Total Outstanding:  ₹2,10,000

💡  Tip: Type "send a payment reminder to Sharma Retail" to notify them.
```

---

### 5. Expense Breakdown

**Purpose:** Show what the business is spending money on.

**Example Inputs:**
```
> What am I spending money on?
> Show my expenses
> Expense breakdown
```

**Example Output:**
```
💸  Expense Breakdown  (Nov 2024 – Apr 2025)
─────────────────────────────────────────────
  Category              Amount        Months
  ─────────────────────────────────────────
  Salaries              ₹5,28,000      6
  Raw Materials         ₹2,28,000      6
  Rent                  ₹1,32,000      6
  Logistics             ₹72,000        6
  Utilities             ₹45,000        6
  Software              ₹13,200        6
  Miscellaneous         ₹30,000        6
  ─────────────────────────────────────────
  Total Expenses:       ₹11,71,600
```

---

### 6. Risk Detection

**Purpose:** Identify clients with a history of late payments or with currently overdue invoices.

**Example Inputs:**
```
> Which clients are at risk?
> Show me payment risks
> Who are my risky clients?
```

**Example Output:**
```
⚠️   Payment Risk Report
──────────────────────────────────────────────────────────────────────
  Client                    Risk Level   Reason
  ──────────────────────────────────────────────────────────────────────
  Sharma Retail Pvt. Ltd.   🔴 HIGH      2 overdue invoices (₹1,25,000 total)
                                          Late on every invoice in last 6 months
                                          Avg. delay: 26 days past due date

  Mehta Exports             🟡 MEDIUM    1 overdue invoice (₹85,000)
                                          1 past invoice paid 18 days late

  QuickShip Logistics       🟢 LOW       All invoices paid on time

  BlueStar Ecom Pvt. Ltd.   ⚪ UNKNOWN   First invoice pending (new client)
  ──────────────────────────────────────────────────────────────────────

💡  Suggested Action: Send a reminder to Sharma Retail Pvt. Ltd.
```

---

### 7. 30-Day Cash Flow Prediction

**Purpose:** Project the business's cash position over the next 30 days based on expected inflows and recurring outflows.

**Example Inputs:**
```
> What will my cash look like in 30 days?
> Predict my cash flow
> Cash flow forecast for next month
```

**Example Output:**
```
🔮  30-Day Cash Flow Forecast  (10 Apr – 10 May 2025)
──────────────────────────────────────────────────────────────
  Starting Balance:  ₹63,400

  Week 1  (10–17 Apr):   +₹62,000 (INV-001 due)   →  ₹1,25,400
  Week 2  (18–24 Apr):   -₹88,000 (Salaries)
                          -₹22,000 (Rent)           →  ₹15,400
  Week 3  (25 Apr–1 May): +₹85,000 (INV-007 due)
                           -₹38,000 (Raw Materials)  →  ₹62,400
  Week 4  (2–10 May):    -₹19,700 (Utilities + Misc) →  ₹42,700
  ──────────────────────────────────────────────────────────────
  Projected Balance:  ₹42,700

⚠️  NOTE: Week 2 cash dips to ₹15,400 — dangerously low.
    This assumes all overdue clients pay on time. If Sharma Retail
    delays further, you may not be able to cover salaries on time.

ℹ️  This is a rule-based projection. It assumes invoices are paid
    on their due dates and recurring expenses repeat as in prior months.
```

---

### 8. Send Payment Reminder

**Purpose:** Send an email reminder to a client with overdue invoices.

**Example Inputs:**
```
> Send a payment reminder to Sharma Retail
> Email reminder to Mehta Exports
> Remind BlueStar Ecom to pay
```

**Example Output (success):**
```
✉️   Sending Payment Reminder...
──────────────────────────────────────────
  To:       accounts@sharmaretail.com
  Client:   Sharma Retail Pvt. Ltd.
  Invoices: INV-001 (₹62,000 — 29 days overdue)
            INV-002 (₹63,000 — 14 days overdue)
  Total:    ₹1,25,000

  ✅  Reminder email sent successfully.
```

**Example Output (no overdue invoices):**
```
ℹ️  No overdue invoices found for "QuickShip Logistics".
    No email has been sent.
```

**Example Output (client not found):**
```
❌  Could not find a client matching "Raj Traders" in the records.
    Please check the client name and try again.
    Type "show overdue invoices" to see all clients with outstanding payments.
```

---

## Error Handling

| Situation | System Response |
|---|---|
| Unrecognized query | Friendly fallback message with suggestion to type "help" |
| Client name not found | Clear error, no action taken |
| No overdue invoices for client | Informational message, no email sent |
| Email sending fails (SMTP error) | Error message with the reason; no crash |
| Malformed data in JSON files | Error message identifying the problematic file |

The system never crashes silently. All errors are caught and displayed in plain language.

---

## Suggested Demo Flow

For a clean, end-to-end demonstration:

```
1.  > help
2.  > What is my current cash balance?
3.  > Give me a cash flow summary
4.  > Show me all overdue invoices
5.  > Which clients are at risk of not paying?
6.  > What will my cash look like in 30 days?
7.  > What am I spending money on?
8.  > Send a payment reminder to Sharma Retail
9.  > exit
```

This flow takes approximately 3–5 minutes and covers all major features.

---

## Exiting the CLI

```
> exit
```
or
```
> quit
```

Output:
```
Goodbye! Stay on top of your cash flow. 💼
```
