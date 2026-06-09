import { useEffect, useState } from "react";
import type { Expense, ExpenseCategory, ExpenseInput } from "@/services/api";
import { CATEGORIES } from "@/lib/expense-utils";

interface Props {
  editing?: Expense | null;
  onSubmit: (data: ExpenseInput) => Promise<void> | void;
  onCancelEdit?: () => void;
  submitting?: boolean;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const fieldClass =
  "w-full rounded-lg border-none bg-[#0f1b3d] px-4 py-3 text-white outline-none transition-all placeholder:text-blue-300/40 focus:ring-2 focus:ring-[#3b6fa0]";

export function ExpenseForm({ editing, onSubmit, onCancelEdit, submitting }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | "">("");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editing) {
      setAmount(String(editing.amount));
      setCategory(editing.category);
      setDate(editing.date);
      setNote(editing.note ?? "");
    } else {
      setAmount("");
      setCategory("");
      setDate(today());
      setNote("");
    }
    setErrors({});
  }, [editing]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) next.amount = "Amount must be a positive number";
    if (!category) next.category = "Category is required";
    if (!date) {
      next.date = "Date is required";
    } else {
      const picked = new Date(date);
      const t = new Date();
      t.setHours(23, 59, 59, 999);
      if (picked > t) next.date = "Date cannot be in the future";
    }
    if (note.length > 200) next.note = "Note must be 200 characters or less";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      amount: Number(Number(amount).toFixed(2)),
      category: category as ExpenseCategory,
      date,
      note: note.trim() || undefined,
    });
    if (!editing) {
      setAmount("");
      setCategory("");
      setDate(today());
      setNote("");
    }
  }

  const labelClass = "mb-2 block text-xs font-bold uppercase tracking-widest text-blue-200";

  return (
    <div className="rounded-2xl bg-[#1e3a5f] p-8 text-white shadow-lg">
      <h3 className="mb-6 text-xl font-bold">{editing ? "Edit Expense" : "Log Expense"}</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="amount" className={labelClass}>Amount</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-blue-300">$</span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-invalid={!!errors.amount}
              className={`${fieldClass} pl-8 tabular-nums`}
            />
          </div>
          {errors.amount && <p className="mt-1.5 text-xs text-red-300">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              aria-invalid={!!errors.category}
              className={fieldClass}
            >
              <option value="">Select</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-300">{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="date" className={labelClass}>Date</label>
            <input
              id="date"
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={!!errors.date}
              className={`${fieldClass} [color-scheme:dark]`}
            />
            {errors.date && <p className="mt-1.5 text-xs text-red-300">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="note" className={labelClass}>Note (Optional)</label>
          <textarea
            id="note"
            rows={2}
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            className={`${fieldClass} resize-none`}
          />
          {errors.note && <p className="mt-1.5 text-xs text-red-300">{errors.note}</p>}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          {editing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 rounded-lg border border-blue-300/30 py-3 text-sm font-semibold text-blue-100 transition-colors hover:bg-[#0f1b3d]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-[#3b6fa0] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#4b8fb0] active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
