# CashGuardian CLI

> A command-line financial assistant for small businesses — ask plain-English questions about your money, detect risks, and take action.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Summary](#architecture-summary)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)

---

## Overview

### The Problem

Small business owners often lack the time, tools, or financial expertise to stay on top of their cash flow. Invoices go unpaid for weeks, expenses quietly pile up, and by the time a problem is noticed, it has already caused damage — a missed payroll, a bounced payment, or a cash crunch.

Most accounting software is either too expensive, too complex, or simply not built for conversational interaction.

### The Solution

**CashGuardian CLI** is a lightweight, terminal-based financial assistant that lets small business owners:

- Ask natural language questions about their finances
- Instantly understand cash flow, overdue invoices, and spending patterns
- Get proactive risk alerts (e.g., "You may run out of cash in 3 weeks")
- Trigger real actions like sending email reminders to late-paying clients

No dashboard. No subscriptions. Just a clean CLI that understands your business.

---

## Features

The following features are fully implemented in this version:

| Feature | Description |
|---|---|
| **Natural Language Queries** | Ask questions like "What is my current cash balance?" or "Which invoices are overdue?" |
| **Cash Flow Summary** | Calculates total income, total expenses, and net cash position |
| **Overdue Invoice Detection** | Flags unpaid invoices past their due date |
| **Payment Risk Alerts** | Rule-based detection of clients with repeated late payments |
| **Expense Breakdown** | Lists and categorizes outgoing payments |
| **Cash Flow Prediction** | Projects cash position over the next 30 days using scheduled inflows/outflows |
| **Email Reminders** | Sends payment reminder emails to overdue clients via Nodemailer |
| **Simulated Dataset** | Operates on a realistic sample business dataset (no real APIs required) |

---

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A Gmail account (or any SMTP provider) for email reminders

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/cashguardian-cli.git
cd cashguardian-cli

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and fill in your email credentials
```

### Environment Variables (`.env`)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CashGuardian <your-email@gmail.com>
```

> **Note:** For Gmail, use an App Password (not your account password). Enable 2FA and generate one under Google Account → Security → App Passwords.

### Run the CLI

```bash
node index.js
```

---

## Usage

Once running, the CLI presents an interactive prompt:

```
Welcome to CashGuardian CLI 💼
Type your question or command. Type "help" to see options.

> _
```

### Example Commands

```bash
# View current cash balance
> What is my current cash balance?

# List overdue invoices
> Show me all overdue invoices

# Get a cash flow summary
> Give me a cash flow summary

# Predict cash position for next 30 days
> What will my cash look like in 30 days?

# Detect high-risk clients
> Which clients are at risk of not paying?

# Send a reminder email to a client
> Send a payment reminder to Sharma Retail
```

See [cli-usage.md](./cli-usage.md) for a full command reference and sample outputs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| CLI Interface | `readline` (built-in Node.js module) |
| Intent Parsing | Custom keyword-matching logic |
| Data Storage | JSON flat files (simulated database) |
| Email | Nodemailer (SMTP) |
| Date Handling | `date-fns` |
| Environment Config | `dotenv` |

No external AI APIs, no databases, no cloud services required.

---

## Project Structure

```
cashguardian-cli/
├── index.js                  # Entry point — starts the CLI loop
├── .env.example              # Sample environment config
├── package.json
│
├── agent/
│   └── queryAgent.js         # Parses user input, routes to correct service
│
├── services/
│   ├── cashFlowService.js    # Cash flow calculations and summaries
│   ├── invoiceService.js     # Invoice lookup and overdue detection
│   ├── riskService.js        # Risk detection logic
│   ├── predictionService.js  # 30-day cash flow projection
│   └── emailService.js       # Nodemailer email sending
│
├── data/
│   ├── transactions.json     # Simulated income and expense records
│   └── invoices.json         # Simulated invoice data
│
├── utils/
│   └── formatter.js          # Output formatting helpers
│
└── docs/
    ├── README.md
    ├── methodology.md
    ├── architecture.md
    ├── agent.md
    ├── data-model.md
    ├── example-company.md
    ├── cli-usage.md
    ├── limitations.md
    └── future-work.md
```

---

## Architecture Summary

CashGuardian CLI follows a simple **layered architecture**:

```
User Input (CLI)
      ↓
  Query Agent         ← interprets natural language intent
      ↓
  Services Layer      ← business logic (cash flow, invoices, risk, email)
      ↓
  Data Layer          ← reads from JSON flat files
      ↓
  Output Formatter    ← prints structured, readable responses
```

Each layer has a single responsibility. The agent does not compute — it routes. Services compute but do not print. The formatter handles all output. This separation makes the code easy to read, test, and extend.

See [architecture.md](./architecture.md) for a detailed breakdown.

---

## Limitations

- Uses simulated data — no real bank, GST, or accounting API integration
- Predictions are rule-based, not machine-learning based
- No graphical interface or web dashboard
- Email reminders require manual SMTP credentials
- Single-user, single-company design (no multi-tenant support)

See [limitations.md](./limitations.md) for a full honest list.

---

## Future Improvements

- Integration with real bank APIs (Plaid, Razorpay, etc.)
- GST filing data import
- Web-based dashboard
- ML-based cash flow forecasting
- Scheduled automated reminders

See [future-work.md](./future-work.md) for details.

---

## License

MIT License. Built for hackathon demonstration purposes.
