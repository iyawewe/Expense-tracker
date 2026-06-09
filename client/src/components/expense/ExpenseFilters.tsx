import { useMemo } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/expense-utils";
import type { ExpenseCategory } from "@/services/api";

export type DateRangePreset = "all" | "this-month" | "last-month" | "custom";

export interface ExpenseFilters {
  category: ExpenseCategory | "All";
  preset: DateRangePreset;
  customFrom: string;
  customTo: string;
}

export const DEFAULT_FILTERS: ExpenseFilters = {
  category: "All",
  preset: "all",
  customFrom: "",
  customTo: "",
};

interface Props {
  filters: ExpenseFilters;
  onChange: (next: ExpenseFilters) => void;
}

export function ExpenseFiltersBar({ filters, onChange }: Props) {
  const isActive = useMemo(
    () =>
      filters.category !== "All" ||
      filters.preset !== "all" ||
      filters.customFrom !== "" ||
      filters.customTo !== "",
    [filters],
  );

  const selectClass =
    "rounded-lg border border-[#3b6fa0]/20 bg-white px-3 py-2 text-sm font-medium text-[#0f1b3d] outline-none transition-all focus:ring-2 focus:ring-[#3b6fa0]";

  return (
    <div className="rounded-2xl border border-white bg-white p-5 shadow-[0_4px_20px_rgba(15,27,61,0.04)]">
      <div className="flex flex-wrap items-end gap-4">
        <FilterField label="Category">
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value as ExpenseCategory | "All" })}
            className={selectClass}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FilterField>

        <FilterField label="Date range">
          <select
            value={filters.preset}
            onChange={(e) => onChange({ ...filters, preset: e.target.value as DateRangePreset })}
            className={selectClass}
          >
            <option value="all">All time</option>
            <option value="this-month">This month</option>
            <option value="last-month">Last month</option>
            <option value="custom">Custom range</option>
          </select>
        </FilterField>

        {filters.preset === "custom" && (
          <>
            <FilterField label="From">
              <input
                type="date"
                value={filters.customFrom}
                max={filters.customTo || undefined}
                onChange={(e) => onChange({ ...filters, customFrom: e.target.value })}
                className={selectClass}
              />
            </FilterField>
            <FilterField label="To">
              <input
                type="date"
                value={filters.customTo}
                min={filters.customFrom || undefined}
                onChange={(e) => onChange({ ...filters, customTo: e.target.value })}
                className={selectClass}
              />
            </FilterField>
          </>
        )}

        {isActive && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#3b6fa0] transition-colors hover:bg-[#e8edf3] hover:text-[#0f1b3d]"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#3b6fa0]">{label}</span>
      {children}
    </div>
  );
}

export function applyFilters<T extends { date: string; category: string }>(
  items: T[],
  filters: ExpenseFilters,
): T[] {
  const { from, to } = resolveRange(filters);
  return items.filter((e) => {
    if (filters.category !== "All" && e.category !== filters.category) return false;
    if (from && e.date < from) return false;
    if (to && e.date > to) return false;
    return true;
  });
}

function resolveRange(filters: ExpenseFilters): { from?: string; to?: string } {
  const now = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  if (filters.preset === "this-month") {
    return {
      from: iso(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
    };
  }
  if (filters.preset === "last-month") {
    return {
      from: iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      to: iso(new Date(now.getFullYear(), now.getMonth(), 0)),
    };
  }
  if (filters.preset === "custom") {
    return { from: filters.customFrom || undefined, to: filters.customTo || undefined };
  }
  return {};
}
