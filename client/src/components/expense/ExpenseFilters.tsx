import React, { useState } from 'react';
import { CATEGORIES } from '../../lib/expense-utils';

export interface ExpenseFilters {
  search: string;
  category: string;
}

export const DEFAULT_FILTERS: ExpenseFilters = {
  search: '',
  category: 'all',
};

// UPGRADED: The layout filter now parses search, category selection, and sorting cleanly
export const applyFilters = (expenses: any[], filters: ExpenseFilters & { sortBy?: string }) => {
  const safeExpenses = expenses || [];
  
  // 1. First apply search and category filtering matching rules
  let filteredResults = safeExpenses.filter((expense) => {
    if (!expense) return false;
    const matchesSearch = (expense.note || '').toLowerCase().includes((filters.search || '').toLowerCase()) ||
                          (expense.category || '').toLowerCase().includes((filters.search || '').toLowerCase());
    const matchesCategory = filters.category === 'all' || expense.category === filters.category;
    return matchesSearch && matchesCategory;
  });

  // 2. Automatically apply sorting algorithms safely based on selection criteria
  const sortOrder = filters.sortBy || 'date-desc';
  return filteredResults.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    const amountA = Number(a.amount || 0);
    const amountB = Number(b.amount || 0);

    switch (sortOrder) {
      case 'date-asc':
        return dateA - dateB;
      case 'amount-desc':
        return amountB - amountA;
      case 'amount-asc':
        return amountA - amountB;
      case 'date-desc':
      default:
        return dateB - dateA;
    }
  });
};

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onChange: React.Dispatch<React.SetStateAction<ExpenseFilters>>;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ filters, onChange }) => {
  // Local state container for handling sorting layouts within the dashboard frame block
  const [sortValue, setSortValue] = useState('date-desc');

  const updateFilter = (key: keyof ExpenseFilters, value: string) => {
    onChange((prev) => {
      const updated = { ...prev, [key]: value, sortBy: sortValue };
      // This injects the sorting value silently into the dashboard calculation hook pipeline
      (prev as any).sortBy = sortValue; 
      return updated;
    });
  };

  const handleSortChange = (newSort: string) => {
    setSortValue(newSort);
    onChange((prev) => {
      const updated = { ...prev, sortBy: newSort };
      (prev as any).sortBy = newSort;
      return updated;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* 1. Search Query Box */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search expenses..."
          className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[#3b6fa0]"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>
      
      {/* 2. Category Selection Dropdown */}
      <div className="w-full md:w-[200px]">
        <select
          className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:outline-none"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c: string) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Sorting Mechanics Box Dropdown */}
      <div className="w-full md:w-[200px]">
        <select
          className="w-full px-3 py-2 border rounded-xl bg-background text-sm focus:outline-none"
          value={sortValue}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
};

export const ExpenseFiltersBar = ExpenseFilters;