import { useEffect, useState } from 'react';
import api, { isUnauthorized } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { Brand, Button, SectionHeading } from '../components/ui';
import type { Transaction, TransactionDraft } from '../types';

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

function SummaryCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'income' | 'expense';
}) {
  const tones = {
    neutral: 'text-text',
    income: 'text-income',
    expense: 'text-expense',
  };

  return (
    <div className="flex flex-col gap-1 rounded-[10px] border border-border bg-surface p-4">
      <span className="text-[0.75rem] uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      <span
        className={`font-mono text-[1.05rem] font-semibold tabular-nums ${tones[tone]}`}
      >
        {value}
      </span>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect with [] as the dependency array runs ONCE after the first
  // render — this is your initState. Fetch-on-mount, exactly like
  // calling cubit.loadTransactions() when a screen opens.
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get<Transaction[]>('/transactions');
        setTransactions(data);
      } catch (err) {
        // 401 here means an expired/invalid token — log out cleanly
        if (isUnauthorized(err)) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (form: TransactionDraft) => {
    const { data } = await api.post<Transaction>('/transactions', form);
    // Never mutate state directly (no transactions.push!) — build a
    // new array so React sees the change. Same immutability rule
    // as emitting new state objects from a Cubit.
    setTransactions([data, ...transactions]);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  // Derived state — computed on every render, never stored.
  // In Flutter you'd compute this in build(); same principle.
  const income = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const balance = income - expenses;

  return (
    <div className="mx-auto max-w-[640px] px-5 pt-8 pb-16">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <Brand />
          <h1 className="font-display text-[1.6rem] font-semibold tracking-[-0.02em]">
            Hello, {user?.username}
          </h1>
        </div>
        <Button variant="ghost" onClick={logout}>
          Sign out
        </Button>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Balance" value={peso.format(balance)} />
        <SummaryCard label="Income" value={peso.format(income)} tone="income" />
        <SummaryCard
          label="Expenses"
          value={peso.format(expenses)}
          tone="expense"
        />
      </section>

      <section className="mb-5 rounded-card border border-border bg-surface p-6">
        <SectionHeading>New transaction</SectionHeading>
        <TransactionForm onAdd={handleAdd} />
      </section>

      <section className="mb-5 rounded-card border border-border bg-surface p-6">
        <SectionHeading>History</SectionHeading>
        {loading ? (
          <p className="py-2.5 text-[0.9rem] text-muted">Loading…</p>
        ) : (
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}

export default Dashboard;
