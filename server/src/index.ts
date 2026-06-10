import express, { Request, Response } from 'express';
import cors from 'cors';
import { Database } from 'bun:sqlite';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new Database(dbPath);
console.log('Connected to persistent Bun SQLite database at:', dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    createdAt TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    actionType TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

const logToDatabase = (actionType: string, description: string) => {
  const id = Date.now().toString();
  const timestamp = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`INSERT INTO activity_logs (id, actionType, description, timestamp, date, createdAt) VALUES (?, ?, ?, ?, ?, ?)`);
  stmt.run(id, actionType, description, timestamp, date, createdAt);
};

app.get('/api/expenses', (req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM expenses ORDER BY createdAt DESC').all();
    res.json(rows || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', (req: Request, res: Response) => {
  const { amount, category, date, note } = req.body;
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  try {
    const stmt = db.prepare(`INSERT INTO expenses (id, amount, category, date, note, createdAt) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(id, amount, category, date, note, createdAt);
    
    logToDatabase("ADD", `Added expense "${note || "Uncategorized"}" under ${category} ($${amount})`);
    res.status(201).json({ id, amount, category, date, note, createdAt });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/expenses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, category, date, note } = req.body;

  try {
    const stmt = db.prepare(`UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?`);
    stmt.run(amount, category, date, note, id);
    
    logToDatabase("UPDATE", `Modified details for "${note || "Uncategorized"}" ($${amount})`);
    res.json({ id, amount, category, date, note });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const row: any = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    if (row) {
      db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
      logToDatabase("DELETE", `Removed expense "${row.note || "Uncategorized"}" ($${row.amount})`);
      res.json({ message: 'Deleted successfully', id });
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', (req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM activity_logs ORDER BY createdAt DESC').all();
    res.json(rows || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/logs/budget', (req: Request, res: Response) => {
  const { description } = req.body;
  logToDatabase("BUDGET_CHANGE", description);
  res.status(201).json({ message: "Budget change logged safely" });
});

app.delete('/api/logs', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM activity_logs').run();
    res.json({ message: 'Audit history cleared successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Persistent Bun-backed runtime running smoothly on port: ${PORT}`);
});