// API client for the Mini Expense Tracker.
// All network requests are isolated here so wiring up a real
// Node.js/Express backend later is just a matter of running it on
// http://localhost:5000 with matching routes.

export const API_BASE_URL = "http://localhost:5000/api";

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Bills"
  | "Entertainment"
  | "Other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO yyyy-mm-dd
  note?: string;
  createdAt?: string;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  // Handle 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const expensesApi = {
  list: () => request<Expense[]>("/expenses"),
  create: (data: ExpenseInput) =>
    request<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: ExpenseInput) =>
    request<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/expenses/${id}`, { method: "DELETE" }),
};

export interface ActivityLog {
  id: string;
  actionType: "ADD" | "DELETE" | "UPDATE" | "BUDGET_CHANGE";
  description: string;
  timestamp: string;
}
