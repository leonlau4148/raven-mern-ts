import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TransactionDraft, TransactionType } from '../types';
import { getErrorMessage } from '../api/axios';
import { Button, Field, FormError } from './ui';

// A reusable child component. `onAdd` is a callback prop — the exact
// pattern of passing a callback into a Flutter widget's constructor.
// The parent (Dashboard) owns the data; this form just reports up.
interface TransactionFormProps {
  onAdd: (draft: TransactionDraft) => Promise<void>;
}

function TransactionForm({ onAdd }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Number() because input values are always strings in the DOM
      await onAdd({ type, amount: Number(amount), category, note });
      // Reset the form on success
      setAmount('');
      setCategory('');
      setNote('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save transaction'));
    } finally {
      setSaving(false);
    }
  };

  const toggleButton = (value: TransactionType, activeClasses: string) =>
    `cursor-pointer rounded-[7px] px-3 py-2 font-medium transition-colors ${
      type === value ? activeClasses : 'bg-transparent text-muted'
    }`;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div
        className="grid grid-cols-2 gap-[3px] overflow-hidden rounded-[10px] border border-border bg-surface-2 p-[3px]"
        role="group"
        aria-label="Transaction type"
      >
        <button
          type="button"
          className={toggleButton('expense', 'bg-expense/18 text-expense')}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={toggleButton('income', 'bg-income/18 text-income')}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      {/* The note field spans both columns via the last-child rule below */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 [&>label:last-child]:sm:col-span-2">
        <Field
          label="Amount (₱)"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
        <Field
          label="Category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Food, Salary, Transport…"
          required
        />
        <Field
          label="Note"
          optional
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Jollibee"
        />
      </div>

      {error && <FormError>{error}</FormError>}

      <Button type="submit" disabled={saving}>
        {saving ? 'Adding…' : 'Add transaction'}
      </Button>
    </form>
  );
}

export default TransactionForm;
