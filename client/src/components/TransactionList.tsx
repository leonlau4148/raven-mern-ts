import type { Transaction } from '../types';

// A "stateless widget" — no hooks, just props in, JSX out.
// Rendering a list with .map() is the ListView.builder equivalent;
// `key` is how React tracks list items across re-renders (like Keys
// in Flutter lists).

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-2.5 text-[0.9rem] text-muted">
        No transactions yet. Add your first one above.
      </p>
    );
  }

  return (
    <ul className="flex list-none flex-col p-0">
      {transactions.map((tx) => (
        <li
          key={tx._id}
          className="flex items-center gap-3.5 border-b border-border py-3 last:border-b-0"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-medium">{tx.category}</span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.8rem] text-muted">
              {new Date(tx.date).toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
              })}
              {tx.note && ` · ${tx.note}`}
            </span>
          </div>
          <span
            className={`font-mono font-semibold tabular-nums ${
              tx.type === 'expense' ? 'text-expense' : 'text-income'
            }`}
          >
            {tx.type === 'expense' ? '−' : '+'}
            {peso.format(tx.amount)}
          </span>
          <button
            className="cursor-pointer rounded-md bg-transparent px-2 py-1.5 text-[0.8rem] leading-none text-muted hover:bg-expense/15 hover:text-expense"
            onClick={() => onDelete(tx._id)}
            aria-label={`Delete ${tx.category} transaction`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;
