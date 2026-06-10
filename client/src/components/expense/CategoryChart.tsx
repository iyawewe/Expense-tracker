import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// FIX 1: Import CATEGORY_COLORS object map instead of a function
import { CATEGORY_COLORS } from '../../lib/expense-utils';

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-[300px] flex flex-col justify-center items-center">
      {total === 0 ? (
        <p className="text-muted-foreground text-sm">No data available for this period</p>
      ) : (
        // FIX 2: Changed h="100%" to height="100%"
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
              {data.map((entry: CategoryData, index: number) => {
                // Safely look up the category color, or default to a gray hex if not found
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