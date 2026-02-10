import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Box, Typography, IconButton, useTheme, alpha 
} from "@mui/material";
import { Expense, SubEvent } from "../types";
import { formatDate, formatCurrency } from "../utils";
import { AddIcon, ReceiptIcon } from "@/assets/icons/InventoryIcons";
import { DeleteIcon } from "lucide-react";

// Import Google-themed components
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

interface ExpenseTableProps {
  expenses: Expense[];
  subEvents: SubEvent[];
  filter: string;
  isMobile: boolean;
  onDeleteExpense: (expenseId: string) => void;
  onAddExpense: () => void;
  darkMode?: boolean;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  subEvents,
  filter,
  isMobile,
  onDeleteExpense,
  onAddExpense,
  darkMode = false,
}) => {
  const theme = useTheme();
  
  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    if (filter === 'noSubevent') return !expense.subEventId;
    return expense.subEventId === filter;
  });

  const getSubEventName = (subEventId?: string) => {
    return subEvents.find(se => se._id === subEventId)?.name || 'Sub-Event';
  };

  if (expenses.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: { xs: 4, sm: 6 }, 
        px: 2,
        backgroundColor: darkMode ? '#303134' : '#ffffff',
      }}>
        <ReceiptIcon
          // style={{
          //   fontSize: isMobile ? 48 : 64,
          //   color: darkMode ? '#5f6368' : '#9aa0a6',
          //   marginBottom: 16,
          //   opacity: 0.5
          // }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124', 
            fontWeight: 500,
            mb: 1,
            fontSize: isMobile ? '1rem' : '1.25rem',
          }}
          gutterBottom
        >
          No expenses recorded yet
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 3,
            color: darkMode ? '#9aa0a6' : '#5f6368',
            fontSize: isMobile ? '0.875rem' : '1rem',
          }}
        >
          Start tracking your event expenses
        </Typography>
        <Button
          variant="contained"
          onClick={onAddExpense}
          size={isMobile ? "medium" : "large"}
          sx={{ 
            backgroundColor: '#34a853',
            '&:hover': { backgroundColor: '#2d9248' }
          }}
        >
          <AddIcon />
          Add First Expense
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ 
      maxHeight: isMobile ? 400 : 500,
      backgroundColor: darkMode ? '#303134' : '#ffffff',
    }}>
      <Table 
        stickyHeader
        sx={{ 
          minWidth: isMobile ? 600 : 'auto',
          backgroundColor: darkMode ? '#303134' : '#ffffff',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            borderBottom: `2px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            py: isMobile ? 1 : 1.5,
            color: darkMode ? '#e8eaed' : '#202124',
          },
          '& .MuiTableCell-body': {
            py: isMobile ? 1 : 1.5,
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            color: darkMode ? '#e8eaed' : '#202124',
            borderBottom: `1px solid ${darkMode ? '#3c4043' : '#f0f0f0'}`,
          },
          '& .MuiTableRow-root': {
            backgroundColor: darkMode ? '#303134' : '#ffffff',
            '&:hover': {
              backgroundColor: darkMode 
                ? alpha('#8ab4f8', 0.08)
                : alpha('#1a73e8', 0.04),
            }
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            {!isMobile && <TableCell>Category</TableCell>}
            <TableCell>Amount</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow 
              key={expense._id} 
              hover
            >
              <TableCell>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                  }}
                >
                  {formatDate(expense.date)}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 200 }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    fontWeight="500"
                    sx={{ 
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                    }}
                  >
                    {expense.description}
                  </Typography>
                  {expense.subEventId && (
                    <Chip
                      label={getSubEventName(expense.subEventId)}
                      size="small"
                      color="secondary"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </TableCell>
              {!isMobile && (
                <TableCell>
                  <Chip
                    label={expense.category}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      height: 24,
                      borderColor: darkMode ? '#3c4043' : '#dadce0',
                      color: darkMode ? '#e8eaed' : '#202124',
                    }}
                  />
                </TableCell>
              )}
              <TableCell>
                <Typography 
                  variant="body2" 
                  fontWeight="600"
                  sx={{ 
                    color: '#34a853',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                  }}
                >
                  {formatCurrency(expense.amount)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onDeleteExpense(expense._id)}
                  sx={{ 
                    border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                    color: darkMode ? '#f28b82' : '#d93025',
                    backgroundColor: darkMode ? 'rgba(242, 139, 130, 0.08)' : 'rgba(217, 48, 37, 0.08)',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(242, 139, 130, 0.12)' : 'rgba(217, 48, 37, 0.12)',
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};