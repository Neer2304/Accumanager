import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface UserBarChartProps {
  data: Array<{ month: string; users: number }>;
  height?: number;
  color?: string;
}

const UserBarChart: React.FC<UserBarChartProps> = ({
  data,
  height = 300,
  color = '#82ca9d',
}) => {
  return (
    <BarChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar 
        dataKey="users" 
        fill={color} 
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  );
};

export default UserBarChart;