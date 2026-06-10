import { createFileRoute, useNavigate } from "@tanstack/react-router"; // 🌟 ADDED: useNavigate
import { useEffect, useState } from "react";
import { History, Trash2, PlusCircle, Edit3, Sliders, LayoutDashboard, Wallet } from "lucide-react";

export const Route = createFileRoute("/history/")({
  component: HistoryPage,
});

interface ActivityLog {
  id: string;
  actionType: "ADD" | "DELETE" | "UPDATE" | "BUDGET_CHANGE";
  description: string;
  timestamp: string;
  date: string;
}

export default function HistoryPage() {
  const navigate = useNavigate(); // 🌟 INITIALIZED: Hook into router context safely
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const loadLogs = () => {
      const saved = localStorage.getItem("app_activity_logs");
      setLogs(saved ? JSON.parse(saved) : []);
    };
    loadLogs();
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to permanently clear all action history logs?")) {
      localStorage.removeItem("app_activity_logs");
      setLogs([]);
    }
  };

  const getActionStyles = (type: ActivityLog["actionType"]) => {
    switch (type) {
      case "ADD": return { bg: "bg-emerald-50/60 border-emerald-100", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", icon: <PlusCircle className="h-4 w-4" /> };
      case "DELETE": return { bg: "bg-rose-50/60 border-rose-100", text: "text-rose-700", badge: "bg-rose-100 text-rose-800", icon: <Trash2 className="h-4 w-4" /> };
      case "UPDATE": return { bg: "bg-amber-50/60 border-amber-100", text: "text-amber-700", badge: "bg-amber-100 text-amber-800", icon: <Edit3 className="h-4 w-4" /> };
      case "BUDGET_CHANGE": return { bg: "bg-sky-50/60 border-sky-100", text: "text-sky-700", badge: "bg-sky-100 text-sky-800", icon: <Sliders className="h-4 w-4" /> };
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#e8edf3] text-[#0f1b3d]">
      {/* Sidebar Navigation Panel */}
      <aside className="sticky top-0 hidden h-screen w-72 flex-col bg-[#0f1b3d] text-white lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b6fa0]">
              <Wallet className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold leading-tight">Mini Expense<br />Tracker</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <button 
            type="button"
            onClick={() => navigate({ to: "/" })} // 🌟 UPGRADED: Instant memory router step
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors text-blue-100/80 hover:bg-[#1e3a5f]/50"
          >
            <LayoutDashboard className="h-5 w-5 opacity-70" />
            Dashboard
          </button>
          <button 
            type="button"
            onClick={() => navigate({ to: "/history" })} // 🌟 UPGRADED: Instant memory router step
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors bg-[#1e3a5f] text-white"
          >
            <History className="h-5 w-5 opacity-70" />
            History
          </button>
        </nav>

        <div className="mt-auto border-t border-[#1e3a5f] p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">Current Plan</p>
          <p className="text-sm font-medium text-white">Personal Basic</p>
        </div>
      </aside>

      {/* Main Interactive Audit Trail Grid */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
        <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-[#0f1b3d] flex items-center gap-3">
              <History className="h-8 w-8 text-[#3b6fa0]" />
              Action History Log
            </h2>
            <p className="mt-1 text-[#3b6fa0]">System audit timeline capturing expense logging, editing updates, and budget modifications.</p>
          </div>
          {logs.length > 0 && (
            <button onClick={handleClearHistory} className="rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 shadow-xs transition-all hover:bg-rose-50/50">
              Clear Log Sheets
            </button>
          )}
        </header>

        <div className="rounded-2xl border border-white bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(15,27,61,0.03)]">
          {logs.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-lg font-bold text-[#0f1b3d]">No Operations Logged Yet</h3>
              <p className="mt-1 text-sm text-[#3b6fa0]/70 max-w-sm mx-auto">Actions like adding expenses or changing limits will construct a trace here.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-[#e8edf3] pl-6 ml-4 space-y-6">
              {logs.map((log) => {
                const styles = getActionStyles(log.actionType) || { bg: "bg-slate-50", text: "text-slate-700", badge: "bg-slate-100", icon: <History className="h-4 w-4" /> };
                return (
                  <div key={log.id} className="relative group">
                    <div className={`absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white ${styles.text} shadow-xs`}>
                      {styles.icon}
                    </div>
                    <div className={`rounded-xl border p-4 bg-white ${styles.bg}`}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md ${styles.badge}`}>
                            {log.actionType}
                          </span>
                          <p className="text-sm font-semibold text-[#0f1b3d]">{log.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#3b6fa0]">
                          <span>{log.timestamp}</span>
                          <span>•</span>
                          <span>{log.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}