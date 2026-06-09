import type { Expense } from "@/services/api";

export const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#0f1b3d",
  Transport: "#1e3a5f",
  Bills: "#3b6fa0",
  Entertainment: "#6b94c2",
  Other: "#a8bdd6",
};

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function isCurrentMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function exportExpensesToCsv(expenses: Expense[], filename = "expenses.csv") {
  const headers = ["Date", "Category", "Note", "Amount"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = expenses.map((e) =>
    [e.date, e.category, e.note ?? "", e.amount.toFixed(2)].map((v) => escape(String(v))).join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
