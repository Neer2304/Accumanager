import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  alpha,
  useTheme,
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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: '100%',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: darkMode 
            ? `0 8px 24px ${alpha(color, 0.3)}`
            : `0 8px 24px ${alpha(color, 0.15)}`,
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: 3,
            backgroundColor: alpha(color, darkMode ? 0.2 : 0.1),
            mb: 2,
          }}
        >
          {React.isValidElement(icon) && 
            React.cloneElement(icon as React.ReactElement<any>, {
              sx: { 
                fontSize: { xs: 30, sm: 36, md: 40 },
                color: color,
              }
            })
          }
        </Box>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            color: color,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            mb: 1,
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          }}
        >
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
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 1.5, sm: 2, md: 3 },
        mb: 4,
        '& > *': {
          flex: '1 1 calc(50% - 12px)',
          minWidth: 0,
          '@media (min-width: 600px)': {
            flex: '1 1 calc(50% - 16px)'
          },
          '@media (min-width: 900px)': {
            flex: '1 1 calc(25% - 18px)'
          }
        }
      }}
    >
      <StatCard
        icon={<MoneyIcon />}
        title="Total Expenses"
        value={`₹${totalAmount.toLocaleString()}`}
        color="#4285f4"
      />
      <StatCard
        icon={<BusinessIcon />}
        title="Business"
        value={`₹${businessTotal.toLocaleString()}`}
        color="#34a853"
      />
      <StatCard
        icon={<PersonIcon />}
        title="Personal"
        value={`₹${personalTotal.toLocaleString()}`}
        color="#8ab4f8"
      />
      <StatCard
        icon={<ReceiptIcon />}
        title="Total Records"
        value={totalRecords.toString()}
        color="#fbbc04"
      />
    </Box>
  );
};

export default ExpenseStats;