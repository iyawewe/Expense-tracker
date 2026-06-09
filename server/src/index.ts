import express from 'express';
import cors from 'cors';
import { ExpenseController } from './controllers/expenseController';

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*' })); // Allows cross-origin traffic from Vite/Lovable client
app.use(express.json());

// REST API Mapping to match Lovable's endpoints
app.get('/api/expenses', ExpenseController.list);
app.post('/api/expenses', ExpenseController.create);
app.put('/api/expenses/:id', ExpenseController.update);
app.delete('/api/expenses/:id', ExpenseController.delete);

app.listen(PORT, () => {
  console.log(`[Engine] Running smoothly on http://localhost:${PORT}`);
});