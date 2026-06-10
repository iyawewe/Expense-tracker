import { TrendingUp, Flame, CheckCircle2 } from "lucide-react";
import type { Expense } from "@/services/api";
import { formatCurrency, isCurrentMonth } from "@/lib/expense-utils";

interface Props {
  expenses: Expense[];
  budget: number; // 🌟 NEW: Accept the dynamic budget value from the parent state
}

export function SummaryCards({ expenses, budget }: Props) {
  const monthlyExpenses = expenses.filter((e) => isCurrentMonth(e.date));
  const spent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const highest = expenses.reduce((max, e) => (e.amount > max ? e.amount : max), 0);
  
  // 🌟 UPGRADED: Using 'budget' prop directly instead of the hardcoded constant
  const remaining = budget - spent;
  const pct = budget > 0 ? Math.min(100, Math.max(0, (spent / budget) * 100)) : 0;
  const overBudget = remaining < 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card 
        label="Spent This Month" 
        value={formatCurrency(spent)} 
        icon={<TrendingUp className="h-4 w-4" />} 
        hint={`${monthlyExpenses.length} transactions logged`} 
      />
      <Card
        label="Highest Expense"
        value={formatCurrency(highest)}
        icon={<Flame className="h-4 w-4" />}
        hint={highest === 0 ? "No expenses yet" : "Top single transaction"}
      />
      <Card
        /* 🌟 DYNAMIC LABEL: Automatically toggles context strings based on balance status */
        label={overBudget ? "Over Budget Amount" : "Remaining Budget"}
        value={formatCurrency(Math.abs(remaining))}
        icon={<CheckCircle2 className="h-4 w-4" />}
      >
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edf3]">
            <div
              className={`h-full transition-all duration-500 ${overBudget ? "bg-destructive" : "bg-[#3b6fa0]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-medium text-[#3b6fa0]">
            <span>{Math.round(pct)}% spent</span>
            <span>{overBudget ? "Over budget" : `of ${formatCurrency(budget)}`}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Card({
  label,
  value,
  icon,
  hint,
  children,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white bg-white p-6 shadow-[0_4px_20px_rgba(15,27,61,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3b6fa0]">{label}</span>
        <div className="rounded-lg bg-[#e8edf3] p-2 text-[#0f1b3d]">{icon}</div>
      </div>
      <div className="text-3xl font-semibold leading-none tabular-nums text-[#0f1b3d]">{value}</div>
      {children ? children : hint ? <div className="mt-4 text-sm text-[#3b6fa0]">{hint}</div> : null}
    </div>
  );
}