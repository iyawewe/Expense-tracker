import express, { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection failed:', err.message);
  else console.log('Connected to persistent SQLite database file at:', dbPath);
});

// 🌟 UPDATED: Initialize BOTH Expenses and Activity Logs tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      createdAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      actionType TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
});

// Helper function to inject logs directly into SQLite
const logToDatabase = (actionType: string, description: string) => {
  const id = Date.now().toString();
  const timestamp = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const createdAt = new Date().toISOString();

  const query = `INSERT INTO activity_logs (id, actionType, description, timestamp, date, createdAt) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [id, actionType, description, timestamp, date, createdAt], (err) => {
    if (err) console.error('Failed to write audit log to SQLite:', err.message);
  });
};

// --- EXPENSES API ROUTES ---

app.get('/api/expenses', (req: Request, res: Response) => {
  db.all('SELECT * FROM expenses ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const { amount, category, date, note } = req.body;
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  const query = `INSERT INTO expenses (id, amount, category, date, note, createdAt) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [id, amount, category, date, note, createdAt], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // 🌟 Log action to SQLite
    logToDatabase("ADD", `Added expense "${note || "Uncategorized"}" under ${category} ($${amount})`);
    res.status(201).json({ id, amount, category, date, note, createdAt });
  });
});

app.put('/api/expenses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, category, date, note } = req.body;

  const query = `UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?`;
  db.run(query, [amount, category, date, note, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // 🌟 Log action to SQLite
    logToDatabase("UPDATE", `Modified details for "${note || "Uncategorized"}" ($${amount})`);
    res.json({ id, amount, category, date, note });
  });
});

app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Fetch item metadata first before deleting so we know what we removed for the log file description
  db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row: any) => {
    if (!err && row) {
      db.run('DELETE FROM expenses WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // 🌟 Log action to SQLite
        logToDatabase("DELETE", `Removed expense "${row.note || "Uncategorized"}" ($${row.amount})`);
        res.json({ message: 'Deleted successfully', id });
      });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  });
});

// --- 🌟 NEW: ACTIVITY LOGS API ROUTES ---

// Fetch logs from SQLite database file
app.get('/api/logs', (req: Request, res: Response) => {
  db.all('SELECT * FROM activity_logs ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Budget tracking log controller triggers manually from client view
app.post('/api/logs/budget', (req: Request, res: Response) => {
  const { description } = req.body;
  logToDatabase("BUDGET_CHANGE", description);
  res.status(201).json({ message: "Budget change logged safely" });
});

// Clear logs table completely
app.delete('/api/logs', (req: Request, res: Response) => {
  db.run('DELETE FROM activity_logs', [], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Audit history cleared successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Persistent TypeScript backend running smoothly on http://localhost:${PORT}`);
});