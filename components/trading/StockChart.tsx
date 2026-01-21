"use client";

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

interface StockChartProps {
  symbol: string;
  currentPrice: number;
}

export default function StockChart({ symbol, currentPrice }: StockChartProps) {
  const [data, setData] = useState<{ time: string; price: number }[]>([]);

  // Initialize and update data points
  useEffect(() => {
    const now = new Date();
    // Create initial history if empty
    if (data.length === 0) {
      const initialPoints = Array.from({ length: 40 }).map((_, i) => ({
        time: new Date(now.getTime() - (40 - i) * 2000).toLocaleTimeString(),
        price: currentPrice + (Math.random() - 0.5) * 10
      }));
      setData(initialPoints);
    } else {
      // Add new price point
      const newPoint = {
        time: now.toLocaleTimeString(),
        price: currentPrice
      };
      setData(prev => [...prev.slice(1), newPoint]);
    }
  }, [currentPrice]);

  return (
    <Box sx={{ 
      bgcolor: '#161a1e', 
      p: 3, 
      borderRadius: 4, 
      border: '1px solid #2b3139',
      height: 550, // Made much larger
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" sx={{ color: 'white', fontWeight: '900' }}>
              {symbol}/USDT
            </Typography>
            <Chip 
              label="LIVE" 
              size="small" 
              icon={<FiberManualRecord sx={{ color: '#2ebd85 !important', fontSize: '12px' }} />}
              sx={{ bgcolor: '#2ebd851a', color: '#2ebd85', fontWeight: 'bold' }} 
            />
          </Stack>
          <Typography variant="body2" sx={{ color: '#848e9c' }}>
            Global Asset Index • Real-time Stream
          </Typography>
        </Box>
        
        <Box textAlign="right">
          <Typography variant="h3" sx={{ color: '#2ebd85', fontWeight: '900' }}>
            ${currentPrice.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#2ebd85' }}>
            +2.45% (24h)
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flexGrow: 1, width: '100%', minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ebd85" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2ebd85" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
            <XAxis 
              dataKey="time" 
              hide={true} 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              orientation="right" 
              stroke="#848e9c" 
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ bgcolor: '#1e2329', border: '1px solid #2b3139', borderRadius: '8px' }}
              itemStyle={{ color: '#2ebd85' }}
              labelStyle={{ color: '#848e9c' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#2ebd85" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}