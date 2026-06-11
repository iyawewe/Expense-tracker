import { Pencil, Trash2 } from "lucide-react";
// FIX 1 & 2: Switched path aliases (@/) to safe relative paths
import type { Expense } from "../../services/api";
import { CATEGORY_COLORS, formatCurrency, formatDate } from "../../lib/expense-utils";

interface Props {
  expenses: Expense[];
  loading?: boolean;
  onEdit: (e: Expense) => void;
  onDelete: (e: Expense) => void;
}

export function ExpenseTable({ expenses, loading, onEdit, onDelete }: Props) {
  // 🌟 FIXED: Remove the hardcoded date sort so it honors the user's selected dropdown filters!
  const sorted = expenses;

  return (
    <section className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_4px_20px_rgba(15,27,61,0.04)]">
      <div className="flex items-center justify-between border-b border-[#e8edf3] p-6">
        <h3 className="text-xl font-bold text-[#0f1b3d]">Recent Expenses</h3>
        <span className="text-xs font-medium text-[#3b6fa0]">{sorted.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#f8fafc] text-[11px] font-bold uppercase tracking-[2px] text-[#3b6fa0]">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Note</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8edf3] text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-sm italic text-[#3b6fa0]">
                  Loading expenses…
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-sm italic text-[#3b6fa0]">
                  No expenses yet. Use the form to log your first one.
                </td>
              </tr>
            ) : (
              sorted.map((e) => {
                // FIX 3: Explicitly cast category string as a key of CATEGORY_COLORS object map
                const categoryKey = e.category as keyof typeof CATEGORY_COLORS;
                const backgroundColor = CATEGORY_COLORS[categoryKey] || '#888888';

                return (
                  <tr key={e.id} className="group transition-colors hover:bg-[#e8edf3]/40">
                    <td className="whitespace-nowrap px-6 py-4 font-medium tabular-nums text-[#1e3a5f]">
                      {formatDate(e.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor }}
                      >
                        {e.category}
                      </span>
                    </td>
                    <td className="max-w-[260px] truncate px-6 py-4 italic text-[#3b6fa0]">
                      {e.note || "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-bold tabular-nums text-[#0f1b3d]">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(e)}
                          aria-label="Edit expense"
                          className="rounded-md p-2 text-[#3b6fa0] transition-colors hover:bg-[#e8edf3] hover:text-[#0f1b3d]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(e)}
                          aria-label="Delete expense"
                          className="rounded-md p-2 text-[#3b6fa0] transition-colors hover:bg-red-50 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}