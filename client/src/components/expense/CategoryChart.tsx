import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../../lib/expense-utils';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface CategoryChartProps {
  expenses: Expense[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ expenses }) => {
  const safeExpenses = expenses || [];

  // Group expenses by category
  const chartDataMap: Record<string, number> = {};
  safeExpenses.forEach((exp) => {
    if (exp && exp.category) {
      chartDataMap[exp.category] = (chartDataMap[exp.category] || 0) + (exp.amount || 0);
    }
  });

  // Format data for Recharts Bar Chart
  const data = Object.entries(chartDataMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize names
    amount: Number(value.toFixed(2)),
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full h-[300px] flex flex-col justify-center items-center bg-white p-6 rounded-xl border border-white shadow-[0_4px_20px_rgba(15,27,61,0.04)]">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#3b6fa0] mb-4 self-start">
        Category Expenditures
      </h3>
      
      {total === 0 ? (
        <p className="text-muted-foreground text-sm my-auto">No data available for this period</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edf3" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#3b6fa0', fontSize: 12, fontWeight: 500 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#3b6fa0', fontSize: 12 }} 
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9', radius: 8 }}
              formatter={(value: number) => [`$${value}`, 'Total Spent']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            />
            {/* The bar uses your custom theme primary color */}
            <Bar dataKey="amount" fill="#3b6fa0" radius={[8, 8, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};