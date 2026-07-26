// Shared domain types — the shape of everything the API hands back.
// Think of these as your Dart model classes, minus the fromJson boilerplate.

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO string over the wire, not a Date
  createdAt: string;
  updatedAt: string;
}

/** The fields the user actually fills in when adding a transaction. */
export interface TransactionDraft {
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

/** Response body of both /auth/login and /auth/register. */
export interface AuthResponse {
  token: string;
  user: User;
}

/** Error body the server sends on a non-2xx. */
export interface ApiError {
  message: string;
}
