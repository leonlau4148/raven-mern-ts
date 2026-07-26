import type { Response } from 'express';
import Transaction from '../models/Transaction.js';
import type { TransactionType } from '../models/Transaction.js';
import type { AuthedRequest } from '../middleware/auth.js';

// Every handler here sits behind the `auth` middleware, so req.userId is
// always set — that's why they take AuthedRequest rather than Request.

interface TransactionBody {
  type?: TransactionType;
  amount?: number;
  category?: string;
  note?: string;
  date?: string;
}

// GET /api/transactions
export const getTransactions = async (
  req: AuthedRequest,
  res: Response
): Promise<void> => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/transactions
export const createTransaction = async (
  req: AuthedRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, amount, category, note, date } = req.body as TransactionBody;

    if (!type || !amount || !category) {
      res
        .status(400)
        .json({ message: 'type, amount, and category are required' });
      return;
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      amount,
      category,
      note,
      date,
    });

    res.status(201).json(transaction);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/transactions/:id
export const updateTransaction = async (
  req: AuthedRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, amount, category, note, date } = req.body as TransactionBody;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { type, amount, category, note, date },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json(transaction);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (
  req: AuthedRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
