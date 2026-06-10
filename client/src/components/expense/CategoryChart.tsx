import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../../lib/expense-utils';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface CategoryChartProps {
  expenses: Expense[]; // <-- Swapped to match what the dashboard passes
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ expenses }) => {
  // FIX 1: Guard against undefined/null by forcing a fallback array
  const safeExpenses = expenses || [];

  // FIX 2: Group and format expenses dynamically inside the component
  const chartDataMap: Record<string, number> = {};
  safeExpenses.forEach((exp) => {
    if (exp && exp.category) {
      chartDataMap[exp.category] = (chartDataMap[exp.category] || 0) + (exp.amount || 0);
    }
  });

  const data = Object.entries(chartDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-[300px] flex flex-col justify-center items-center bg-white p-6 rounded-xl border border-white shadow-[0_4px_20px_rgba(15,27,61,0.04)]">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#3b6fa0] mb-4 self-start">Category Breakdown</h3>
      {total === 0 ? (
        <p className="text-muted-foreground text-sm my-auto">No data available for this period</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => {
                const categoryKey = entry.name as keyof typeof CATEGORY_COLORS;
                const fillColor = CATEGORY_COLORS[categoryKey] || '#888888';
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};