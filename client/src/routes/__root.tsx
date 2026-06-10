import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, History, BarChart3, Wallet } from "lucide-react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#e8edf3] text-[#0f1b3d]">
      {/* 🌟 GLOBAL SIDEBAR NAVIGATION: Rendered inside Router Context safely */}
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
          <Link
            to="/"
            activeProps={{ className: "bg-[#1e3a5f] text-white" }}
            inactiveProps={{ className: "text-blue-100/80 hover:bg-[#1e3a5f]/50" }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 opacity-70" />
            Dashboard
          </Link>

          <Link
            to="/history"
            activeProps={{ className: "bg-[#1e3a5f] text-white" }}
            inactiveProps={{ className: "text-blue-100/80 hover:bg-[#1e3a5f]/50" }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors"
          >
            <History className="h-5 w-5 opacity-70" />
            History
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors text-blue-100/80 hover:bg-[#1e3a5f]/50"
          >
            <BarChart3 className="h-5 w-5 opacity-70" />
            Analytics
          </button>
        </nav>

        <div className="mt-auto border-t border-[#1e3a5f] p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
            Current Plan
          </p>
          <p className="text-sm font-medium text-white">Personal Basic</p>
        </div>
      </aside>

      {/* The active page content route (Dashboard or History) is dynamically injected here */}
      <Outlet />
    </div>
  );
}