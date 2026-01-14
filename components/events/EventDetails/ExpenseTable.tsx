import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Box, Typography, Button, IconButton, Chip, useTheme, alpha 
} from "@mui/material";
// import { AddIcon, DeleteIcon, ReceiptIcon } from "@mui/icons-material";
import { Expense, SubEvent } from "../types";
import { formatDate, formatCurrency } from "../utils";
import { AddIcon, ReceiptIcon } from "@/assets/icons/InventoryIcons";
import { DeleteIcon } from "lucide-react";

interface ExpenseTableProps {
  expenses: Expense[];
  subEvents: SubEvent[];
  filter: string;
  isMobile: boolean;
  onDeleteExpense: (expenseId: string) => void;
  onAddExpense: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  subEvents,
  filter,
  isMobile,
  onDeleteExpense,
  onAddExpense,
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
      <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
        <ReceiptIcon
          sx={{
            fontSize: { xs: 48, sm: 64 },
            color: 'text.secondary',
            mb: 2,
            opacity: 0.5
          }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No expenses recorded yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start tracking your event expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddExpense}
          size={isMobile ? "medium" : "large"}
        >
          Add First Expense
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: isMobile ? 400 : 500 }}>
      <Table 
        stickyHeader
        sx={{ 
          minWidth: isMobile ? 600 : 'auto',
          '& .MuiTableCell-head': {
            fontWeight: 'bold',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `2px solid ${theme.palette.divider}`,
            fontSize: isMobile ? '0.85rem' : '0.875rem',
            py: isMobile ? 1 : 1.5,
          },
          '& .MuiTableCell-body': {
            py: isMobile ? 1 : 1.5,
            fontSize: isMobile ? '0.85rem' : '0.875rem',
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
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              <TableCell>
                <Typography variant="body2">
                  {formatDate(expense.date)}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 200 }}>
                <Box>
                  <Typography variant="body2" fontWeight="500">
                    {expense.description}
                  </Typography>
                  {expense.subEventId && (
                    <Chip
                      label={getSubEventName(expense.subEventId)}
                      size="small"
                      sx={{ mt: 0.5, height: 20 }}
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
                    sx={{ height: 24 }}
                  />
                </TableCell>
              )}
              <TableCell>
                <Typography 
                  variant="body2" 
                  fontWeight="600"
                  color="primary.main"
                >
                  {formatCurrency(expense.amount)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDeleteExpense(expense._id)}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
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