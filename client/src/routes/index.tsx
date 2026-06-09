import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutDashboard, History, BarChart3, Download, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { SummaryCards } from "../components/expense/SummerCards";
import { CategoryChart } from "../components/expense/CategoryChart";
import { ExpenseTable } from "../components/expense/ExpenseTable";
import { ExpenseForm } from "../components/expense/ExpenseForm";
import {
  ExpenseFiltersBar,
  DEFAULT_FILTERS,
  applyFilters,
  type ExpenseFilters,
} from "../components/expense/ExpenseFilters";
import { expensesApi, type Expense, type ExpenseInput } from "../services/api";
import { exportExpensesToCsv } from "../lib/expense-utils";

// This should only appear ONCE in the file
export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  // Your code stays exactly the same below...
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => applyFilters(expenses, filters), [expenses, filters]);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expensesApi.list();
      setExpenses(data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load expenses", {
        description: "Make sure the API is running on http://localhost:5000.",
      });
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  async function handleSubmit(data: ExpenseInput) {
    setSubmitting(true);
    try {
      if (editing) {
        await expensesApi.update(editing.id, data);
        toast.success("Expense updated");
        setEditing(null);
      } else {
        await expensesApi.create(data);
        toast.success("Expense logged");
      }
      await loadExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(e: Expense) {
    if (!confirm("Delete this expense?")) return;
    try {
      await expensesApi.remove(e.id);
      toast.success("Expense deleted");
      if (editing?.id === e.id) setEditing(null);
      await loadExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex min-h-screen w-full bg-[#e8edf3] text-[#0f1b3d]">
      {/* Sidebar Navigation Panel */}
      <aside className="sticky top-0 hidden h-screen w-72 flex-col bg-[#0f1b3d] text-white lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b6fa0]">
              <Wallet className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold leading-tight">
              Mini Expense
              <br />
              Tracker
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <NavItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" active />
          <NavItem icon={<History className="h-5 w-5" />} label="History" />
          <NavItem icon={<BarChart3 className="h-5 w-5" />} label="Analytics" />
        </nav>

        <div className="mt-auto border-t border-[#1e3a5f] p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
            Current Plan
          </p>
          <p className="text-sm font-medium text-white">Personal Basic</p>
        </div>
      </aside>

      {/* Main Metric & Dashboard Layout Canvas */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
        <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-[#0f1b3d]">Monthly Overview</h2>
            <p className="mt-1 text-[#3b6fa0]">Tracking spending for {monthLabel}</p>
          </div>
          <button
            onClick={() => exportExpensesToCsv(filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 self-start rounded-lg border border-[#3b6fa0]/20 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </header>

        {/* Aggregated Financial Analytics Cards */}
        <div className="mb-8">
  <SummaryCards expenses={filtered} />
</div>

        {/* Dynamic Filtering Toolbelt */}
        <div className="mb-8">
          <ExpenseFiltersBar filters={filters} onChange={setFilters} />
        </div>

        {/* Two-Column Transaction Interface Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <ExpenseForm
              editing={editing}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditing(null)}
            />
          </div>

          <div className="space-y-8 xl:col-span-2">
            <CategoryChart expenses={filtered} />
            <ExpenseTable
              expenses={filtered}
              loading={loading}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
        active ? "bg-[#1e3a5f] text-white" : "text-blue-100/80 hover:bg-[#1e3a5f]/50"
      }`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}