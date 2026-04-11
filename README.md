# CashGuardian CLI

Talk to your business finances in plain English with grounded, benchmarked insights.

## Overview

CashGuardian is a Node.js CLI assistant for SME finance analysis. It answers natural-language questions on cash flow, overdue invoices, risk, anomalies, and forecasts using a locked local dataset plus optional AI narrative support.

## Features

- Deterministic financial calculations over benchmark-locked data files
- Intent-based query routing for cash, invoices, risk, prediction, compare, and summary flows
- AI provider abstraction (`gemini`, `groq`, `openrouter`) with safe fallback
- Benchmark runner with latency reporting
- Unit tests for services and query routing

## Install and Run

```bash
npm install
copy .env.example .env
npm test
npm start
```

## Tech Stack

- Node.js
- Jest
- date-fns
- Nodemailer
- dotenv
- Gemini / Groq / OpenRouter APIs

## Usage

Examples:

- `What is my current cash balance?`
- `Show me all overdue invoices`
- `What will my cash look like in 30 days?`
- `Compare this month vs last month`

For full documentation, architecture, methodology, benchmark numbers, and CLI reference, see:

- [docs/README.md](C:\Users\sapan.nv\OneDrive\Desktop\natwest\CashGuardian\docs\README.md)
- [docs/architecture.md](C:\Users\sapan.nv\OneDrive\Desktop\natwest\CashGuardian\docs\architecture.md)
- [docs/methodology.md](C:\Users\sapan.nv\OneDrive\Desktop\natwest\CashGuardian\docs\methodology.md)
- [docs/cli-usage.md](C:\Users\sapan.nv\OneDrive\Desktop\natwest\CashGuardian\docs\cli-usage.md)
