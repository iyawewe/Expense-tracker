import db from '../config/db';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt?: string;
}

export class ExpenseService {
  
  static getAll(): Promise<Expense[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM expenses ORDER BY date DESC, id DESC`;
      db.all(query, [], (err, rows: any[]) => {
        if (err) return reject(err);
        
        // Map native integer id into a string for the client layer
        const formatted = rows.map(row => ({
          ...row,
          id: row.id.toString()
        }));
        resolve(formatted);
      });
    });
  }

  static create(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO expenses (amount, category, date, note) VALUES (?, ?, ?, ?)`;
      const values = [expense.amount, expense.category, expense.date, expense.note || null];

      db.run(query, values, function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID.toString(),
          ...expense
        });
      });
    });
  }

  static update(id: string, expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense | null> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?`;
      const intId = parseInt(id, 10);
      const values = [expense.amount, expense.category, expense.date, expense.note || null, intId];

      db.run(query, values, function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(null);
        resolve({ id, ...expense });
      });
    });
  }

  static delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const intId = parseInt(id, 10);
      db.run(`DELETE FROM expenses WHERE id = ?`, [intId], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}