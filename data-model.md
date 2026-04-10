# Data Model — CashGuardian CLI

This document describes the structure of the data files used in CashGuardian CLI, including field definitions, example records, and the assumptions underlying the data.

---

## Overview

CashGuardian CLI uses two JSON flat files to simulate a small business's financial records:

| File | Purpose |
|---|---|
| `data/transactions.json` | All income received and expenses paid |
| `data/invoices.json` | All invoices issued to clients, with payment status |

Both files are read-only at runtime. They serve as the system's simulated database.

---

## 1. Transactions (`data/transactions.json`)

### Structure

```json
[
  {
    "id": "TXN-001",
    "date": "2025-01-05",
    "type": "income",
    "category": "Client Payment",
    "description": "Payment received from Mehta Exports for INV-003",
    "amount": 85000,
    "currency": "INR",
    "party": "Mehta Exports"
  },
  {
    "id": "TXN-002",
    "date": "2025-01-10",
    "type": "expense",
    "category": "Rent",
    "description": "Office rent for January 2025",
    "amount": 22000,
    "currency": "INR",
    "party": "Sunrise Realty"
  }
]
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique transaction identifier (e.g., `TXN-001`) |
| `date` | string (ISO 8601) | Date the transaction occurred (`YYYY-MM-DD`) |
| `type` | enum | Either `"income"` or `"expense"` |
| `category` | string | Business category (see categories below) |
| `description` | string | Human-readable description of the transaction |
| `amount` | number | Amount in smallest unit of currency (whole rupees) |
| `currency` | string | Currency code — always `"INR"` in this dataset |
| `party` | string | The other party involved (client name or vendor) |

### Income Categories

| Category | Meaning |
|---|---|
| `Client Payment` | Payment received from a business client |
| `Advance` | Upfront payment received before work is done |
| `Refund Received` | Money returned from a vendor or supplier |

### Expense Categories

| Category | Meaning |
|---|---|
| `Rent` | Monthly office or workspace rent |
| `Salaries` | Employee salary payments |
| `Utilities` | Electricity, water, internet bills |
| `Vendor Payment` | Payments to suppliers or contractors |
| `Software` | SaaS tools, subscriptions |
| `Logistics` | Courier, delivery, freight costs |
| `Miscellaneous` | Any other operational expenses |

---

## 2. Invoices (`data/invoices.json`)

### Structure

```json
[
  {
    "id": "INV-001",
    "clientName": "Sharma Retail Pvt. Ltd.",
    "clientEmail": "accounts@sharmaretail.com",
    "issueDate": "2025-01-01",
    "dueDate": "2025-01-31",
    "amount": 62000,
    "currency": "INR",
    "status": "overdue",
    "paymentReceivedDate": null,
    "description": "Supply of 200 units - Jan batch",
    "invoiceItems": [
      { "item": "Product A", "quantity": 120, "unitPrice": 310, "total": 37200 },
      { "item": "Product B", "quantity": 80, "unitPrice": 310, "total": 24800 }
    ]
  },
  {
    "id": "INV-004",
    "clientName": "Mehta Exports",
    "clientEmail": "finance@mehtaexports.com",
    "issueDate": "2024-11-01",
    "dueDate": "2024-11-30",
    "amount": 85000,
    "currency": "INR",
    "status": "paid",
    "paymentReceivedDate": "2024-12-18",
    "description": "Export order processing - Nov 2024",
    "invoiceItems": [
      { "item": "Export Service Fee", "quantity": 1, "unitPrice": 85000, "total": 85000 }
    ]
  }
]
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique invoice identifier (e.g., `INV-001`) |
| `clientName` | string | Full name of the client company |
| `clientEmail` | string | Client's accounts/billing email address |
| `issueDate` | string (ISO 8601) | Date the invoice was issued |
| `dueDate` | string (ISO 8601) | Payment due date as agreed with client |
| `amount` | number | Total invoice amount in INR |
| `currency` | string | Always `"INR"` in this dataset |
| `status` | enum | Payment status (see below) |
| `paymentReceivedDate` | string or null | Date payment was actually received; `null` if not yet paid |
| `description` | string | Brief description of what the invoice covers |
| `invoiceItems` | array | Line items that make up the invoice |

### Invoice Status Values

| Status | Meaning |
|---|---|
| `"paid"` | Invoice has been settled; `paymentReceivedDate` is set |
| `"pending"` | Invoice issued; due date is in the future |
| `"overdue"` | Due date has passed; payment not received |

---

## 3. How Data Is Used in Calculations

| Calculation | Source Data |
|---|---|
| Total income | Sum of all `transactions` where `type === "income"` |
| Total expenses | Sum of all `transactions` where `type === "expense"` |
| Net cash balance | `totalIncome - totalExpenses` |
| Overdue invoices | `invoices` where `status !== "paid"` AND `dueDate < today` |
| Late payment history | `invoices` where `paymentReceivedDate - dueDate > 15 days` |
| 30-day forecast (inflows) | `invoices` where `status === "pending"` AND `dueDate` is within 30 days |
| 30-day forecast (outflows) | Recurring `transactions` of type `"expense"` projected forward |

---

## 4. Assumptions Made About the Data

The following assumptions are built into the system logic:

- All amounts are in **Indian Rupees (INR)**. Multi-currency is not supported.
- **Recurring expenses** are identified by matching the same `category` and `party` appearing in consecutive months. No explicit `recurring` flag exists in the data.
- The **current cash balance** is computed as cumulative income minus cumulative expenses across all transaction history. There is no opening balance or bank account balance in the dataset.
- An invoice is considered **paid late** if `paymentReceivedDate` is more than 15 days after `dueDate`.
- The `clientEmail` field in invoices is used for sending email reminders. It is assumed to be valid.
- There are no partial payments. An invoice is either fully paid or not paid.
- All dates use the **ISO 8601 format** (`YYYY-MM-DD`). Malformed dates will cause errors.
- The dataset covers approximately **6 months of activity** (Nov 2024 – Apr 2025).
