import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
} from '@mui/material';
import { Add as AddIcon, Receipt as ReceiptIcon } from '@mui/icons-material';

interface ExpenseHeaderProps {
  onAddExpense: () => void;
  totalExpenses: number;
}

const ExpenseHeader: React.FC<ExpenseHeaderProps> = ({ 
  onAddExpense, 
  totalExpenses 
}) => {
  return (
    <Paper
      sx={{
        p: { xs: 3, sm: 4 },
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 250,
          height: 250,
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />

      {/* Header Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                width: 56,
                height: 56,
              }}
            >
              <ReceiptIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Expense Tracker
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Track your personal and business expenses • {totalExpenses} records
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddExpense}
          sx={{
            backgroundColor: 'white',
            color: '#667eea',
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'grey.100',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(255, 255, 255, 0.4)',
            },
            transition: 'all 0.3s',
            minWidth: { xs: '100%', sm: 'auto' },
          }}
        >
          Add Expense
        </Button>
      </Box>
    </Paper>
  );
};

export default ExpenseHeader;