import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';

export class ExpenseController {

  static async list(req: Request, res: Response) {
    try {
      const list = await ExpenseService.getAll();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { amount, category, date, note } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number.' });
      }
      if (!category) {
        return res.status(400).json({ error: 'Category is a required field.' });
      }
      if (!date || new Date(date) > new Date()) {
        return res.status(400).json({ error: 'Date cannot be in the future.' });
      }

      const item = await ExpenseService.create({ amount, category, date, note });
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const item = await ExpenseService.update(id, req.body);
      if (!item) return res.status(404).json({ error: 'Target transaction record not found.' });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const successful = await ExpenseService.delete(id);
      if (!successful) return res.status(404).json({ error: 'Target transaction record not found.' });
      res.status(204).send(); // Matches 204 No Content handling in Lovable's client file
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}