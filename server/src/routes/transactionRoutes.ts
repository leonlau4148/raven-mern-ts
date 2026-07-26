import express from 'express';
import type { RequestHandler } from 'express';
import auth from '../middleware/auth.js';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

router.use(auth); // protects EVERY route below — [Authorize] at controller level

// The handlers take AuthedRequest (userId guaranteed by the middleware
// above), which Express's RequestHandler signature doesn't know about.
// This cast is the seam between the two — safe because `auth` runs first.
const authed = (handler: unknown) => handler as RequestHandler;

router.get('/', authed(getTransactions));
router.post('/', authed(createTransaction));
router.put('/:id', authed(updateTransaction));
router.delete('/:id', authed(deleteTransaction));

export default router;
