import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { Expense } from "@/services/api";
import { CATEGORIES, CATEGORY_COLORS, formatCurrency } from "@/lib/expense-utils";

interface Props {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: Props) {
  const data = useMemo(() => {
    const totals: Record<string, number> = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    });
    return CATEGORIES.map((c) => ({ category: c, amount: Number(totals[c].toFixed(2)) }));
  }, [expenses]);

  const hasData = data.some((d) => d.amount > 0);

  return (
    <section className="rounded-2xl border border-white bg-white p-8 shadow-[0_4px_20px_rgba(15,27,61,0.04)]">
      <h3 className="mb-8 text-xl font-bold text-[#0f1b3d]">Spending by Category</h3>
      <div className="h-56 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8edf3" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fill: "#3b6fa0", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#3b6fa0", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                cursor={{ fill: "#e8edf3", opacity: 0.5 }}
                contentStyle={{
                  background: "#0f1b3d",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                  fontFamily: "IBM Plex Sans",
                }}
                formatter={(value: number) => [formatCurrency(value), "Total"]}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm italic text-[#3b6fa0]">
            No expense data yet. Log your first expense to see analytics.
          </div>
        )}
      </div>
    </section>
  );
}
