import { PORT } from './config/env.js';
import connectDB from './config/db.js';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import auth from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Raven MERN API running' });
});

app.get('/api/me', auth, (req: Request, res: Response) => {
  res.json({ message: 'You are authenticated', userId: req.userId });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
