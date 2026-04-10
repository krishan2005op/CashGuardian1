# Limitations — CashGuardian CLI

This document honestly describes the current limitations of CashGuardian CLI. It exists because transparency about what a system *cannot* do is just as important as describing what it can do — especially for a hackathon project that may be evaluated by technical judges.

---

## 1. No Real-Time Data Integration

CashGuardian CLI operates entirely on **static, pre-loaded JSON files**. There is no live connection to any external data source.

- No bank account sync (no Plaid, Open Banking, or RazorpayX integration)
- No GST portal data (no GSTIN lookup, no filing status)
- No ERP or accounting software integration (no Tally, Zoho Books, QuickBooks)
- No payment gateway data (no Razorpay, PayU, Cashfree webhook events)

**Impact:** The financial data shown is simulated. It will not reflect a real business's actual transactions. Any "insights" are only as good as the mock data provided.

---

## 2. No Real API Integrations

All data in the system is fabricated for demonstration purposes.

- The "clients" (Sharma Retail, Mehta Exports, etc.) are fictional
- The transactions and invoices are manually authored
- No API calls are made to fetch real financial data at any point

This means the system **cannot be used for real financial decision-making** in its current state.

---

## 3. Rule-Based Predictions Only

The 30-day cash flow forecast is computed using simple deterministic rules:

- Expected inflows = sum of pending invoice amounts, assumed paid on due date
- Expected outflows = prior month's recurring expenses, assumed to repeat

**What this means in practice:**
- The model does not account for partial payments
- It does not model payment delays probabilistically
- It assumes perfect repetition of past expense patterns
- It has no awareness of seasonal variation, one-off expenses, or changing business conditions
- It is not a machine learning model and does not improve with more data

The prediction is useful as a **rough planning tool** but should not be treated as a reliable forecast.

---

## 4. No Graphical Interface

CashGuardian CLI is a **terminal-only application**. There is no:

- Web dashboard
- Mobile app
- Chart or graph rendering (no revenue trend lines, no pie charts)
- Export to PDF or Excel

All output is plain text printed to the terminal. While readable, this limits how much information can be communicated at once, and makes comparisons across time periods harder to visualise.

---

## 5. Limited Natural Language Understanding

The query agent uses **keyword matching**, not a large language model or NLP library.

**This means:**
- Queries must contain recognised keywords to work
- Spelling mistakes may cause queries to go unrecognised
- Complex or compound questions will not be parsed correctly
  - e.g., "What was my income in January minus the expenses from Sharma?" — not supported
- There is no context retention between queries — each is processed independently
- Synonyms not in the keyword list will not match
  - e.g., "delinquent invoices" will not match the overdue intent unless explicitly added

---

## 6. Email Requires Manual SMTP Setup

The email reminder feature requires the user to configure SMTP credentials in a `.env` file. This adds a setup step that:

- May be unfamiliar to non-technical users
- Requires a Gmail App Password or another SMTP provider
- Will not work if the credentials are incorrect or missing
- Does not retry on failure

Email sending is **not automated or scheduled**. It only happens when the user explicitly asks for a reminder.

---

## 7. Single Company, Single User

The system is designed to represent exactly **one company**. It does not support:

- Multiple companies or business units
- Multiple user accounts or access roles
- Switching between datasets at runtime

The company's data is hardcoded into the JSON files. Changing the company requires manually editing those files.

---

## 8. No Data Persistence or History

CashGuardian CLI does not write any data. It is fully read-only.

- There is no way to add new transactions through the CLI
- There is no record of past queries or actions taken
- Sending an email does not update the invoice status in the JSON file
- If the same reminder is sent twice, the system will not warn you

---

## 9. No Input Validation on Data Files

The system does not validate the structure of `transactions.json` or `invoices.json` before loading them.

- If a date field is malformed, a calculation will fail or produce incorrect results
- If a required field is missing, the system may crash with an unhelpful error
- There is no schema validation layer

For a production system, this would be unacceptable. For a prototype, it is an acknowledged gap.

---

## 10. Amounts Are INR-Only

All monetary values in the dataset are in **Indian Rupees (INR)**. The system does not support multi-currency operations or currency conversion.

---

## Summary

| Limitation | Severity | Notes |
|---|---|---|
| No real-time data | High | Core constraint for this prototype |
| No real APIs | High | By design for hackathon scope |
| Rule-based predictions | Medium | Transparent and honest; not ML |
| No graphical interface | Medium | CLI-only by design |
| Limited NLP | Medium | Keyword matching works for defined use cases |
| Manual SMTP setup | Low | One-time configuration |
| Single company/user | Low | Acceptable for demo scope |
| No data persistence | Low | Read-only by design |
| No input validation | Low | Should be added before production use |
| INR only | Low | Acceptable for Indian SMB focus |

These limitations are deliberate trade-offs made to keep the project buildable, testable, and demonstrable within a hackathon timeframe. See [future-work.md](./future-work.md) for how each of these could be addressed in a production version.
