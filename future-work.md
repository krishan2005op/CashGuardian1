# Future Work — CashGuardian CLI

This document outlines realistic improvements and extensions that could be built on top of CashGuardian CLI if time, resources, and scope allow. Each item is grounded in what is technically feasible — not aspirational marketing language.

---

## 1. Real Banking & Financial API Integration

**Current state:** All data is simulated via JSON files.

**Future state:** Connect to real financial data sources.

### Potential Integrations

| API / Service | What It Would Enable |
|---|---|
| **RazorpayX Banking API** | Real-time account balance, transaction feed |
| **Plaid (India: FinBox, Perfios)** | Bank statement aggregation across multiple accounts |
| **GSTN APIs** | GST return filing status, input tax credit balance |
| **Tally / Zoho Books webhook** | Automatic sync when new invoices or transactions are recorded |

### What Would Change

- `transactions.json` would be replaced by API calls fetching live records
- The data layer would need a caching mechanism to avoid rate limits
- Authentication (OAuth2 or API keys) would need secure storage
- Error handling would need to account for API downtime

---

## 2. Web Dashboard / UI

**Current state:** Terminal-only output. No charts or visual summaries.

**Future state:** A lightweight web interface alongside the CLI.

### Ideas

- **React + Chart.js** dashboard showing income vs expense trends over time
- Cash flow timeline chart with projected inflow/outflow markers
- Invoice table with filter, sort, and status update
- One-click "Send Reminder" button per client row

### Approach

The existing service layer (`cashFlowService`, `invoiceService`, etc.) could be exposed as a **REST API** using Express.js. The same business logic would power both the CLI and the web UI without duplication.

---

## 3. ML-Based Cash Flow Forecasting

**Current state:** Rule-based projection that assumes invoices are paid on time and expenses repeat identically.

**Future state:** A model that learns from payment patterns and predicts delays.

### Possible Approaches

| Approach | Description |
|---|---|
| **Linear Regression** | Predict payment delay in days based on client history, invoice size, and seasonality |
| **Time Series Forecasting (ARIMA / Prophet)** | Model monthly cash flow as a time series; predict future months |
| **Classification Model** | Predict whether a given invoice will be paid on time, late, or default |

### What Data Is Needed

At least 12–24 months of transaction and invoice history per client. With real API integration (see item 1), this becomes feasible.

### Honest Note

ML adds real value here only when trained on real historical data. Using ML on the current simulated dataset of ~30 records would be misleading and would not produce meaningful predictions.

---

## 4. Automated Scheduled Reminders

**Current state:** Reminders are only sent when the user explicitly requests them.

**Future state:** The system automatically detects and sends reminders on a schedule.

### Design

- A background job (using `node-cron` or a cloud scheduler like AWS EventBridge) would run daily
- It would check for invoices crossing configurable thresholds (e.g., 7 days before due, on due date, 3 days after)
- Reminders would be sent automatically without any user input
- A log of sent reminders would be maintained to avoid duplicates

### Additional Feature: Escalation Logic

If a reminder goes unanswered for 7 days, escalate to a second, firmer email. If still unanswered after 14 days, flag for manual follow-up.

---

## 5. Multi-Company and Multi-User Support

**Current state:** Hardcoded single-company dataset.

**Future state:** Support multiple businesses with separate data and user accounts.

### Design

- Replace JSON files with a proper database (PostgreSQL or MongoDB)
- Each company gets its own schema/collection
- Users authenticate with JWT tokens
- Role-based access: Owner sees everything; Accountant sees financials; Sales sees only invoices

---

## 6. WhatsApp / SMS Notifications

**Current state:** Email reminders only.

**Future state:** Reach clients through additional channels.

### Tools

- **WhatsApp Business API (via Twilio or Gupshup)** — Send payment reminder messages directly to client's WhatsApp
- **Twilio SMS** — Send SMS reminders as a fallback
- **IVR (future)** — Automated voice call for severely overdue accounts

This is particularly valuable for Indian SMBs where WhatsApp is the primary business communication channel.

---

## 7. Improved Natural Language Understanding

**Current state:** Keyword matching with a fixed list of patterns.

**Future state:** More flexible query understanding.

### Approaches

| Approach | Complexity | Benefit |
|---|---|---|
| Add more keyword synonyms | Low | Handles more phrasings without major changes |
| Use a local NLP library (e.g., `compromise` for Node.js) | Medium | Better entity extraction, handles typos |
| Integrate a small LLM (e.g., Claude API, Ollama locally) | High | Full natural language understanding, complex queries |

### If Using an LLM

The LLM would be used only for **intent parsing and response generation**. All actual calculations would still be done by the deterministic service layer. This avoids hallucinated financial figures while enabling much more flexible query handling.

---

## 8. Invoice Generation & PDF Export

**Current state:** Invoices exist only as JSON records.

**Future state:** Generate professional PDF invoices and export financial reports.

### Tools

- `pdfkit` or `puppeteer` (Node.js) for generating PDF invoices
- Send generated PDF as an email attachment
- Export cash flow summary as an Excel file using `exceljs`

---

## 9. Audit Trail & Action Logging

**Current state:** No record of what actions were taken or when.

**Future state:** Persistent log of all system actions.

### Log Entries Would Include

- Timestamp, query made, intent detected, service called
- Emails sent (to whom, for which invoices, when)
- Risk alerts triggered
- Any errors encountered

This would enable compliance tracking and debugging in a production context.

---

## 10. Mobile App

**Current state:** CLI only.

**Future state:** Native or cross-platform mobile app.

### Approach

- **React Native** or **Flutter** frontend consuming the Express.js REST API (see item 2)
- Push notifications for overdue invoice alerts and low balance warnings
- Voice input using device microphone for hands-free queries

---

## Priority Roadmap (Suggested Order)

| Priority | Feature | Reason |
|---|---|---|
| 1 | REST API layer over services | Enables web UI and mobile app |
| 2 | Real API integration (bank/accounting) | Moves product from demo to real-world use |
| 3 | Web dashboard | Dramatically improves usability |
| 4 | Scheduled automated reminders | Reduces manual effort for users |
| 5 | Improved NLP / LLM integration | Broadens query flexibility |
| 6 | ML-based forecasting | Adds genuine predictive value |
| 7 | Multi-user / multi-company | Enables SaaS product model |
| 8 | WhatsApp/SMS notifications | India-specific high-value channel |
| 9 | PDF invoice generation | Common small business need |
| 10 | Mobile app | Broadens accessibility |
