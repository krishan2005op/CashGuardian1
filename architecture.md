# Architecture — CashGuardian CLI

This document describes the technical architecture of CashGuardian CLI — how it is structured, why it is structured that way, and what each component is responsible for.

---

## 1. High-Level Overview

CashGuardian CLI is a **single-process, layered Node.js application**. It runs entirely on the local machine, reads from flat JSON files, and outputs results to the terminal.

There is no server, no cloud dependency, and no database engine. This was intentional — for a hackathon project, simplicity and clarity of design matter more than scale.

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Terminal)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │  text input / output
┌───────────────────────────▼─────────────────────────────────┐
│                     CLI Interface Layer                       │
│              index.js  +  readline (Node built-in)           │
└───────────────────────────┬─────────────────────────────────┘
                            │  raw string
┌───────────────────────────▼─────────────────────────────────┐
│                       Agent Layer                             │
│                    agent/queryAgent.js                        │
│         (intent detection + service routing)                  │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────┘
       │          │          │          │          │
┌──────▼──┐ ┌────▼────┐ ┌───▼────┐ ┌───▼────┐ ┌──▼──────────┐
│  Cash   │ │ Invoice │ │  Risk  │ │Predict │ │   Email     │
│  Flow   │ │ Service │ │Service │ │Service │ │  Service    │
│ Service │ │         │ │        │ │        │ │(Nodemailer) │
└──────┬──┘ └────┬────┘ └───┬────┘ └───┬────┘ └─────────────┘
       │         │          │          │
┌──────▼─────────▼──────────▼──────────▼──────────────────────┐
│                        Data Layer                             │
│          data/transactions.json  +  data/invoices.json        │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     Output Formatter                          │
│                    utils/formatter.js                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Layer-by-Layer Breakdown

### Layer 1: CLI Interface (`index.js`)

**Responsibility:** Accept user input, pass it to the agent, and print the response.

- Uses Node.js built-in `readline` module
- Runs an event-driven loop — no polling, no blocking
- Handles `exit` / `quit` commands to terminate cleanly
- Does **not** contain any business logic

**Why:** `readline` is lightweight, has zero dependencies, and is sufficient for a conversational CLI interface.

---

### Layer 2: Agent (`agent/queryAgent.js`)

**Responsibility:** Understand what the user is asking and route the request to the right service.

- Performs **intent detection** using keyword and phrase matching
- Maps recognized intents to service function calls
- Assembles a response object from service output
- Does **not** perform calculations itself

Supported intents:

| Intent | Trigger Phrases |
|---|---|
| `QUERY_CASH_BALANCE` | "cash balance", "how much cash", "current balance" |
| `QUERY_CASH_FLOW` | "cash flow", "income and expenses", "summary" |
| `QUERY_OVERDUE` | "overdue", "unpaid invoices", "late invoices" |
| `QUERY_RISK` | "risk", "at risk", "payment risk", "risky clients" |
| `QUERY_PREDICTION` | "next 30 days", "predict", "forecast", "future cash" |
| `QUERY_EXPENSES` | "expenses", "spending", "what am I spending" |
| `ACTION_SEND_REMINDER` | "send reminder", "email reminder", "remind [client]" |
| `HELP` | "help", "what can you do" |

If no intent is recognized, the agent returns a friendly fallback message.

**Why:** A keyword-matching agent is honest, debuggable, and fast. For a hackathon with a defined use case and limited query types, it is the right tool. There is no hallucination risk, no latency, and no API cost.

---

### Layer 3: Services

Each service is a focused module that does one thing well.

#### `cashFlowService.js`
- Loads all transactions
- Computes total income, total expenses, net cash flow
- Groups expenses by category for breakdowns

#### `invoiceService.js`
- Loads all invoices
- Filters overdue invoices (unpaid + past due date)
- Returns invoice details for a specific client when needed

#### `riskService.js`
- Detects overdue invoices
- Identifies clients with a history of late payments
- Generates low-cash-balance warnings

#### `predictionService.js`
- Computes current balance
- Projects inflows (unpaid future invoices) and outflows (recurring expenses)
- Returns a week-by-week 30-day forecast

#### `emailService.js`
- Accepts invoice data and client email
- Constructs a payment reminder email
- Sends it via Nodemailer using SMTP credentials from `.env`

**Why separate services?** Each service can be tested, modified, or replaced independently. Adding a new feature (e.g., a GST summary service) does not require touching existing code.

---

### Layer 4: Data (`data/`)

**Responsibility:** Store all simulated financial data in structured JSON files.

- `transactions.json` — all income and expense records
- `invoices.json` — all invoice records including payment status and due dates

Data is loaded synchronously at query time using `fs.readFileSync`. For a dataset of this size (dozens of records), this is fast enough and avoids async complexity.

**Why JSON?** JSON is human-readable, easy to edit for demo purposes, and requires no database setup. It is the right choice for a prototype.

---

### Layer 5: Output Formatter (`utils/formatter.js`)

**Responsibility:** Convert raw data objects into readable terminal output.

- Formats currency values (e.g., `₹1,84,500`)
- Formats dates (e.g., `15 Mar 2025`)
- Renders tables, lists, and warning banners
- All terminal output passes through this layer

**Why a dedicated formatter?** Services return plain data objects. Keeping formatting separate means the same service can be reused in a future web API or dashboard without changes.

---

## 3. Data Flow — Step by Step

Using the query **"Show me overdue invoices"** as an example:

```
1. User types: "Show me overdue invoices"

2. readline fires 'line' event → index.js calls agent.handle(input)

3. queryAgent.js scans input for keywords
   → detects "overdue" → intent = QUERY_OVERDUE

4. Agent calls invoiceService.getOverdueInvoices()

5. invoiceService loads data/invoices.json
   → filters records where status !== "paid" AND dueDate < today
   → returns array of overdue invoice objects

6. Agent receives result, passes to formatter

7. formatter.renderInvoiceList(invoices) → builds terminal output string

8. index.js prints the formatted string to console
```

Total time: < 50ms (reading a small JSON file + in-memory filtering).

---

## 4. Why This Architecture?

| Decision | Reason |
|---|---|
| No database | JSON files are readable, editable, and require zero setup |
| No external AI API | Keeps the project self-contained and fast; no API keys or latency |
| No web server | CLI is sufficient; reduces complexity significantly |
| Layered design | Each layer is independently testable and readable |
| Nodemailer for email | Mature, well-documented, works with any SMTP provider |
| Single-process Node.js | Appropriate for the scope; no need for workers or queues |

This architecture reflects the constraints of a hackathon project: it should be **understandable in 10 minutes**, **runnable with one command**, and **honest about what it does**.
