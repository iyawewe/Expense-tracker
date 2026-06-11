# 🔌 Mini Expense Tracker - API Documentation

All data transfer operations communicate via the `application/json` content type. 

* **Production Base URL:** `https://expense-tracker-backend-9y4t.onrender.com/api`
* **Local Development Base URL:** `http://localhost:5000/api`

---

## 💵 1. Expenses Routing Suite

### • `GET /expenses`
* **Description:** Retrieves all recorded financial transactions from the persistent SQLite database ledger.
* **Headers:** `Content-Type: application/json`
* **Response Shape (200 OK):**
```json
[
  {
    "id": "exp_8391a2bc",
    "amount": 1250.50,
    "category": "Bills",
    "date": "2026-06-11",
    "note": "Production Hosting Setup",
    "createdAt": "2026-06-11T01:32:00.000Z"
  }
]

• POST /expenses
Description: Persists a brand new transaction record into the database file array.

Headers: Content-Type: application/json

Request Body Shape:
{
  "amount": 45.20,
  "category": "Food",
  "date": "2026-06-10",
  "note": "Team Lunch Collaboration"
}

Response Shape (201 Created):
{
  "id": "exp_9011fcd4",
  "amount": 45.20,
  "category": "Food",
  "date": "2026-06-10",
  "note": "Team Lunch Collaboration",
  "createdAt": "2026-06-11T01:33:15.000Z"
}

• PUT /expenses/:id
Description: Modifies the structural field parameters of an existing transaction record matching the unique ID.

Headers: Content-Type: application/json

Request Body Shape:
{
  "amount": 55.00,
  "category": "Food",
  "date": "2026-06-10",
  "note": "Premium Catering Event"
}

Response Shape (200 OK):
{
  "id": "exp_9011fcd4",
  "amount": 55.00,
  "category": "Food",
  "date": "2026-06-10",
  "note": "Premium Catering Event",
  "createdAt": "2026-06-11T01:33:15.000Z"
}

• DELETE /expenses/:id
Description: Permanently purges a transaction record matching the targeted ID from the SQLite rows.

Response Shape (200 OK):
{
  "success": true,
  "message": "Expense successfully purged from records",
  "id": "exp_9011fcd4"
}

📑 2. System Audit Logs Suite
• GET /logs
Description: Returns the complete system audit log timeline history array to track UI modifications.

Response Shape (200 OK):
[
  {
    "id": "log_1122aabb",
    "actionType": "ADD",
    "description": "Logged new expense 'Premium Catering Event' under Food ($55)",
    "timestamp": "01:34 AM",
    "date": "Jun 11, 2026"
  }
]

• POST /logs/budget
Description: Appends a custom structural system configuration statement to the audit log trail when budget caps are modified.

Request Body Shape:
{
  "description": "Updated monthly budget limit to $2,500"
}

Response Shape (201 Created):
{
  "id": "log_3344ccdd",
  "actionType": "BUDGET_CHANGE",
  "description": "Updated monthly budget limit to $2,500",
  "timestamp": "01:35 AM",
  "date": "Jun 11, 2026"
}

• DELETE /logs
Description: Completely wipes all historical timeline records from the SQLite system log sheet.

Response Shape (200 OK):
{
  "success": true,
  "message": "Audit trail database records completely cleared"
}
