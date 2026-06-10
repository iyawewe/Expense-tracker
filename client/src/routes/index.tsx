import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutDashboard, History, Trash2, PlusCircle, Edit3, Sliders, Download, Wallet, FileText, Flame } from "lucide-react";
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
import userpfp from "@/assets/user.jpeg";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

interface ActivityLog {
  id: string;
  actionType: "ADD" | "DELETE" | "UPDATE" | "BUDGET_CHANGE";
  description: string;
  timestamp: string;
  date: string;
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "history">("dashboard");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem("app_budget_limit");
    return saved ? Number(saved) : 2000;
  });

  const loadLogs = useCallback(async () => {
    try {
      // FIX 1: Pointed directly to the /api/logs data endpoint wrapper array
      const response = await fetch("https://expense-tracker-backend-9y4t.onrender.com/api/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data || []);
      }
    } catch (err) {
      console.error("Failed to sync backend logs:", err);
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expensesApi.list();
      setExpenses(data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load expenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
    loadLogs();
  }, [loadExpenses, loadLogs, activeTab]);

  const handleBudgetChange = async (value: number) => {
    const cleanValue = Math.max(0, value);
    setBudget(cleanValue);
    localStorage.setItem("app_budget_limit", cleanValue.toString());
    
    try {
      // FIX 2: Migrated budget change log router path link from local to Render
      await fetch("https://expense-tracker-backend-9y4t.onrender.com/api/logs/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: `Updated monthly budget limit to $${cleanValue.toLocaleString()}` })
      });
      loadLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const exportLogsToCsv = () => {
    if (logs.length === 0) return;
    const headers = ["Date", "Timestamp", "Action Type", "Description"];
    const rows = logs.map(log => [`"${log.date}"`, `"${log.timestamp}"`, `"${log.actionType}"`, `"${log.description.replace(/"/g, '""')}"`]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `system_audit_logs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit logs exported");
  };

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
      await loadLogs();
    } catch (err) {
      toast.error("Save failed");
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
      await loadLogs();
    } catch (err) {
      toast.error("Delete failed");
    }
  }

  const handleClearHistory = async () => {
    if (!confirm("Permanently clear all activity history logs from SQLite database file?")) return;
    try {
      // FIX 3: Swapped log wipe router interface from local environment to live server
      const response = await fetch("https://expense-tracker-backend-9y4t.onrender.com/api/logs", { method: "DELETE" });
      if (response.ok) {
        setLogs([]);
        toast.success("Log records wiped from SQLite");
      }
    } catch (err) {
      toast.error("Failed to clear logs");
    }
  };

  const filtered = useMemo(() => applyFilters(expenses, filters), [expenses, filters]);

  const spendRoastMessage = useMemo(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    if (expenses.length === 0) return "No expenses logged yet. Your wallet is safe... for now.";
    if (totalSpent > budget) return `🚨 CRITICAL DAMAGE: You are $${(totalSpent - budget).toLocaleString()} over budget! Your bank account is officially on life support.`;
    
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => { categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount; });
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      const [catName, catAmt] = topCategory;
      if (catName.toLowerCase().includes("food")) return `🍔 ROAST: You spent $${catAmt.toLocaleString()} on ${catName}. Your kitchen stove must be crying from neglect.`;
      if (catName.toLowerCase().includes("entertainment")) return `💸 ROAST: $${catAmt.toLocaleString()} gone into ${catName}! Retail therapy won't solve your problems.`;
      return `📈 ROAST: ${catName} is eating your funds ($${catAmt.toLocaleString()}).`;
    }
    return "Spending patterns look normal.";
  }, [expenses, budget]);

  const getActionStyles = (type: ActivityLog["actionType"]) => {
    switch (type) {
      case "ADD": return { bg: "bg-emerald-50/60 border-emerald-100", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", icon: <PlusCircle className="h-4 w-4" /> };
      case "DELETE": return { bg: "bg-rose-50/60 border-rose-100", text: "text-rose-700", badge: "bg-rose-100 text-rose-800", icon: <Trash2 className="h-4 w-4" /> };
      case "UPDATE": return { bg: "bg-amber-50/60 border-amber-100", text: "text-amber-700", badge: "bg-amber-100 text-amber-800", icon: <Edit3 className="h-4 w-4" /> };
      case "BUDGET_CHANGE": return { bg: "bg-sky-50/60 border-sky-100", text: "text-sky-700", badge: "bg-sky-100 text-sky-800", icon: <Sliders className="h-4 w-4" /> };
    }
  };

  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex min-h-screen w-full bg-[#e8edf3] text-[#0f1b3d]">
      <aside className="sticky top-0 hidden h-screen w-72 flex-col bg-[#0f1b3d] text-white lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b6fa0]"><Wallet className="h-5 w-5" /></div>
            <h1 className="text-xl font-bold leading-tight">Mini Expense<br />Tracker</h1>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 px-4">
          <button type="button" onClick={() => setActiveTab("dashboard")} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-[#1e3a5f] text-white" : "text-blue-100/80 hover:bg-[#1e3a5f]/50"}`}><LayoutDashboard className="h-5 w-5 opacity-70" />Dashboard</button>
          <button type="button" onClick={() => setActiveTab("history")} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${activeTab === "history" ? "bg-[#1e3a5f] text-white" : "text-blue-100/80 hover:bg-[#1e3a5f]/50"}`}><History className="h-5 w-5 opacity-70" />History</button>
        </nav>
        
        <div className="mt-auto border-t border-[#1e3a5f] p-5">
          <div className="flex items-center gap-3">
            <img 
              src={userpfp} 
              alt="Loveneet Singh" 
              className="h-11 w-11 rounded-full object-cover border border-[#3b6fa0]/40 shadow-md bg-[#1e3a5f]"
              onError={(e) => {
                e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=Loveneet&backgroundColor=3b6fa0";
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-semibold tracking-wide text-white">Loveneet Singh</span>
              <span className="truncate text-xs font-medium text-blue-200/60">Premium Developer</span>
            </div>
          </div>
        </div>
      </aside>

      {activeTab === "dashboard" ? (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><h2 className="text-3xl font-bold text-[#0f1b3d]">Monthly Overview</h2><p className="mt-1 text-[#3b6fa0]">Tracking spending for {monthLabel}</p></div>
            <button onClick={() => exportExpensesToCsv(filtered)} disabled={filtered.length === 0} className="flex items-center gap-2 rounded-lg border border-[#3b6fa0]/20 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-white/80 disabled:opacity-50"><Download className="h-4 w-4" />Export CSV</button>
          </header>

          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm flex items-start gap-3.5">
            <div className="rounded-lg bg-amber-500 p-2 text-white mt-0.5"><Flame className="h-4 w-4 animate-pulse" /></div>
            <div><h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">AI Financial Accountant Roast</h4><p className="mt-1 text-sm font-medium text-[#0f1b3d]">{spendRoastMessage}</p></div>
          </div>

          <div className="mb-8"><SummaryCards expenses={filtered} budget={budget} /></div>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex-1"><ExpenseFiltersBar filters={filters} onChange={setFilters} /></div>
            <div className="flex items-center gap-3 border-t pt-4 lg:border-t-0 lg:pt-0 border-[#e8edf3]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b6fa0] whitespace-nowrap">Set Budget Limit:</span>
              <div className="relative flex items-center rounded-xl bg-[#e8edf3] px-3 py-1.5"><span className="text-sm font-semibold text-[#3b6fa0] mr-1">$</span><input type="number" value={budget === 0 ? "" : budget} onChange={(e) => handleBudgetChange(Number(e.target.value))} className="w-24 bg-transparent border-none p-0 text-sm font-bold text-[#0f1b3d] focus:ring-0 outline-none" placeholder="0" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="xl:col-span-1"><ExpenseForm editing={editing} submitting={submitting} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} /></div>
            <div className="space-y-8 xl:col-span-2"><CategoryChart expenses={filtered} /><ExpenseTable expenses={filtered} loading={loading} onEdit={setEditing} onDelete={handleDelete} /></div>
          </div>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
          <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><h2 className="text-3xl font-bold text-[#0f1b3d] flex items-center gap-3"><History className="h-8 w-8 text-[#3b6fa0]" />Action History Log</h2><p className="mt-1 text-[#3b6fa0]">System audit timeline loaded entirely from your SQLite Database.</p></div>
            <div className="flex items-center gap-3">{logs.length > 0 && (<><button onClick={exportLogsToCsv} className="flex items-center gap-2 rounded-lg border border-[#3b6fa0]/20 bg-white px-4 py-2.5 text-xs font-bold text-[#0f1b3d] shadow-sm hover:bg-white/80"><Download className="h-3.5 w-3.5 text-[#3b6fa0]" />Download Logs (CSV)</button><button onClick={handleClearHistory} className="rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 shadow-sm hover:bg-rose-50/50">Clear Log Sheets</button></>)}</div>
          </header>

          <div className="rounded-2xl border border-white bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(15,27,61,0.03)]">
            {logs.length === 0 ? (
              <div className="py-20 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8edf3] text-[#3b6fa0]"><FileText className="h-7 w-7" /></div><h3 className="text-lg font-bold text-[#0f1b3d]">No Database Logs Yet</h3></div>
            ) : (
              <div className="relative border-l-2 border-[#e8edf3] pl-6 ml-4 space-y-6">
                {logs.map((log) => {
                  const styles = getActionStyles(log.actionType) || { bg: "bg-slate-50", text: "text-slate-700", badge: "bg-slate-100", icon: <History className="h-4 w-4" /> };
                  return (
                    <div key={log.id} className="relative group">
                      <div className={`absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white ${styles.text} shadow-sm`}>{styles.icon}</div>
                      <div className={`rounded-xl border p-4 bg-white ${styles.bg}`}>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-2.5"><span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md ${styles.badge}`}>{log.actionType}</span><p className="text-sm font-semibold text-[#0f1b3d]">{log.description}</p></div>
                          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#3b6fa0]"><span>{log.timestamp}</span><span>•</span><span>{log.date}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      )}
      <Toaster richColors position="top-right" />
    </div>
  );
} 