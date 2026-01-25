import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface ExpenseStatsProps {
  totalAmount: number;
  businessTotal: number;
  personalTotal: number;
  totalRecords: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: 3,
            bgcolor: `${color}15`,
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  totalAmount,
  businessTotal,
  personalTotal,
  totalRecords,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 3,
        mb: 4,
      }}
    >
      <StatCard
        icon={<MoneyIcon sx={{ fontSize: 40, color: '#667eea' }} />}
        title="Total Expenses"
        value={`₹${totalAmount.toLocaleString()}`}
        color="#667eea"
      />
      <StatCard
        icon={<BusinessIcon sx={{ fontSize: 40, color: '#00d2d3' }} />}
        title="Business"
        value={`₹${businessTotal.toLocaleString()}`}
        color="#00d2d3"
      />
      <StatCard
        icon={<PersonIcon sx={{ fontSize: 40, color: '#ff9f43' }} />}
        title="Personal"
        value={`₹${personalTotal.toLocaleString()}`}
        color="#ff9f43"
      />
      <StatCard
        icon={<ReceiptIcon sx={{ fontSize: 40, color: '#764ba2' }} />}
        title="Total Records"
        value={totalRecords.toString()}
        color="#764ba2"
      />
    </Box>
  );
};

export default ExpenseStats;