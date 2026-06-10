import React from 'react';
import { CATEGORIES } from '../../lib/expense-utils';

export interface ExpenseFilters {
  search: string;
  category: string;
}

export const DEFAULT_FILTERS: ExpenseFilters = {
  search: '',
  category: 'all',
};

export const applyFilters = (expenses: any[], filters: ExpenseFilters) => {
  return expenses.filter((expense) => {
    const matchesSearch = expense.note?.toLowerCase().includes(filters.search.toLowerCase()) ||
                          expense.category?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || expense.category === filters.category;
    return matchesSearch && matchesCategory;
  });
};

interface ExpenseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search expenses..."
          className="w-full px-3 py-2 border rounded-md bg-background"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="w-full md:w-[200px]">
        <select
          className="w-full px-3 py-2 border rounded-md bg-background"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c: string) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-[200px]">
        <select
          className="w-full px-3 py-2 border rounded-md bg-background"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
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