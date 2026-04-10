# Agent — How CashGuardian Understands Your Questions

This document explains the "agent" in CashGuardian CLI — what it does, how it works, and what its actual capabilities are (and are not).

---

## 1. What Is the Agent?

The agent is the brain of CashGuardian CLI. It sits between the user's raw text input and the system's services.

Its job is simple:
1. Read what the user typed
2. Figure out what they want (intent detection)
3. Call the right service to fulfill the request
4. Package the result into a clear, structured response

It does **not** perform any calculations itself. It does **not** use a large language model (LLM) or any external AI API. It is a focused, rule-based routing module written in plain JavaScript.

---

## 2. Why "Agent" and Not "Chatbot"?

The term "agent" is used deliberately. Unlike a simple chatbot that only responds, this module:

- **Decides what to do** — not just what to say
- **Selects a service** based on interpreted intent
- **Triggers real actions** (like sending emails), not just text responses
- **Structures its output** with an answer, an explanation, and a data source reference

This makes it an agent in the software sense: a component that perceives input and acts on it purposefully.

---

## 3. How Intent Detection Works

Intent detection is done through **keyword and phrase matching**. The agent scans the lowercased user input for known patterns associated with each intent.

### The Detection Process

```javascript
function detectIntent(input) {
  const text = input.toLowerCase();

  if (text.includes("cash balance") || text.includes("how much cash") || text.includes("current balance")) {
    return "QUERY_CASH_BALANCE";
  }
  if (text.includes("overdue") || text.includes("unpaid") || text.includes("late invoice")) {
    return "QUERY_OVERDUE";
  }
  if (text.includes("risk") || text.includes("at risk") || text.includes("risky")) {
    return "QUERY_RISK";
  }
  if (text.includes("predict") || text.includes("forecast") || text.includes("30 days") || text.includes("next month")) {
    return "QUERY_PREDICTION";
  }
  if (text.includes("send reminder") || text.includes("email reminder") || text.includes("remind")) {
    return "ACTION_SEND_REMINDER";
  }
  // ... additional patterns
  return "UNKNOWN";
}
```

Matching is **first-match wins** — the most specific patterns are checked before broader ones.

---

## 4. Supported Intents

| Intent ID | What the User Is Asking | Example Input |
|---|---|---|
| `QUERY_CASH_BALANCE` | Current cash position | "What is my cash balance?" |
| `QUERY_CASH_FLOW` | Income vs expenses summary | "Give me a cash flow summary" |
| `QUERY_OVERDUE` | List of unpaid/late invoices | "Which invoices are overdue?" |
| `QUERY_EXPENSES` | Breakdown of spending | "What am I spending money on?" |
| `QUERY_RISK` | Clients with payment risk | "Who are my risky clients?" |
| `QUERY_PREDICTION` | 30-day cash forecast | "What will my cash look like next month?" |
| `ACTION_SEND_REMINDER` | Send email to a client | "Send a reminder to Sharma Retail" |
| `HELP` | Show available commands | "What can you do?" / "help" |
| `UNKNOWN` | Unrecognized input | (anything not matched) |

---

## 5. How the Agent Decides What to Do

For each detected intent, the agent follows a simple decision tree:

```
QUERY_CASH_BALANCE
  → call cashFlowService.getBalance()
  → format and return result

QUERY_CASH_FLOW
  → call cashFlowService.getSummary()
  → format income, expenses, net

QUERY_OVERDUE
  → call invoiceService.getOverdueInvoices()
  → list each overdue invoice with days overdue

QUERY_RISK
  → call riskService.detectRisks()
  → list flagged clients and warning type

QUERY_PREDICTION
  → call predictionService.get30DayForecast()
  → render weekly projection

ACTION_SEND_REMINDER
  → extract client name from input
  → call invoiceService.getOverdueByClient(clientName)
  → if found: call emailService.sendReminder(invoice, clientEmail)
  → if not found: return "No overdue invoices found for [client]"

UNKNOWN
  → return fallback message with suggestion to type "help"
```

---

## 6. How the Agent Extracts Parameters

For action intents, the agent may need to extract a parameter from the user's message — most commonly, a **client name**.

This is done using a simple string extraction approach:

```javascript
function extractClientName(input) {
  // Match phrases like "remind Sharma Retail" or "send reminder to Mehta Exports"
  const match = input.match(/(?:remind|reminder to|email)\s+(.+)/i);
  return match ? match[1].trim() : null;
}
```

This works reliably for the defined set of clients in the simulated dataset. It does not handle complex or ambiguous phrasing, and the system is transparent about that.

---

## 7. How Responses Are Structured

Every response from the agent follows a consistent structure:

```javascript
{
  answer: "You have 3 overdue invoices totalling ₹1,25,000.",
  explanation: "These invoices are unpaid and past their due date.",
  source: "data/invoices.json",
  action: null  // or { type: "email_sent", to: "sharma@retailco.com" }
}
```

| Field | Description |
|---|---|
| `answer` | The direct, one-line answer to the user's question |
| `explanation` | Context or detail to help the user understand |
| `source` | Which data file or service produced this result |
| `action` | If an action was taken (e.g., email sent), a record of it |

This structure ensures the formatter can render responses consistently.

---

## 8. What the Agent Cannot Do

Being transparent about limitations is important:

- **Cannot understand complex sentences** — "What was my income last quarter minus the rent I paid in January?" will not be parsed correctly
- **Cannot handle spelling mistakes** — "overdue invoicess" may not match
- **Cannot remember context** — each query is independent; it does not remember what was asked before
- **Cannot learn** — it does not improve over time or adapt to user patterns
- **Cannot make judgment calls** — it follows rules strictly; it does not infer intent beyond its keyword patterns

For a defined, domain-specific CLI tool with known query types, these limitations are acceptable. The system is honest about what it can and cannot do.
