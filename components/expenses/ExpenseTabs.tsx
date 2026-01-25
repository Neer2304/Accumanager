import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { Expense, ExpenseStats } from '@/types/expense';
import { expenseCategories, paymentMethods } from '@/data/expenseData';
import { getCategoryIcon } from './icons/CategoryIcons';
import { getPaymentMethodIcon } from './icons/PaymentMethodIcons';

interface ExpenseTabsProps {
  activeTab: number;
  onTabChange: (value: number) => void;
  expenses: Expense[];
  stats: ExpenseStats | null;
  loading: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  isMobile: boolean;
}

const ExpenseTabs: React.FC<ExpenseTabsProps> = ({
  activeTab,
  onTabChange,
  expenses,
  stats,
  loading,
  onEditExpense,
  onDeleteExpense,
  isMobile,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getCategoryInfo = (category: string) => {
    return (
      expenseCategories.find((cat) => cat.value === category) ||
      expenseCategories[expenseCategories.length - 1]
    );
  };

  const getPaymentMethodInfo = (method: string) => {
    return (
      paymentMethods.find((pm) => pm.value === method) || paymentMethods[0]
    );
  };

  // Render Payment Method Icon
  const PaymentIcon = ({ method }: { method: string }) => {
    const IconComponent = getPaymentMethodIcon(method);
    return <IconComponent />;
  };

  // Calculate totals for categories
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Category Card Component
  const CategoryCard = ({ category, totalAmount }: { 
    category: typeof expenseCategories[0]; 
    totalAmount: number;
  }) => {
    const categoryExpenses = expenses.filter(e => e.category === category.value);
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = totalAmount > 0 ? (total / totalAmount) * 100 : 0;

    return (
      <Card sx={{ borderRadius: 3, height: '100%', overflow: 'hidden' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: category.color,
                width: 48,
                height: 48,
                fontSize: 24,
              }}
            >
              {getCategoryIcon(category.value)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {category.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {categoryExpenses.length} {categoryExpenses.length === 1 ? 'expense' : 'expenses'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            ₹{total.toLocaleString()}
          </Typography>
          {expenses.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {percentage.toFixed(1)}% of total
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  mt: 0.5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: '100%',
                    bgcolor: category.color,
                    transition: 'width 0.3s',
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Tabs */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 600,
              py: 2,
              minHeight: 64,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#667eea',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#667eea',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab
            label={isMobile ? 'Expenses' : 'All Expenses'}
            icon={isMobile ? <ReceiptIcon /> : undefined}
            iconPosition="start"
          />
          <Tab
            label="Statistics"
            icon={isMobile ? <CategoryIcon /> : undefined}
            iconPosition="start"
          />
          <Tab
            label="Categories"
            icon={isMobile ? <CreditCardIcon /> : undefined}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {/* All Expenses Tab */}
        {activeTab === 0 && (
          <>
            {/* Expenses Table */}
            <TableContainer
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: 'grey.50',
                      '& th': {
                        fontWeight: 600,
                        color: 'text.primary',
                        borderBottomColor: 'divider',
                      },
                    }}
                  >
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    {!isMobile && <TableCell>Payment</TableCell>}
                    {!isMobile && <TableCell>Date</TableCell>}
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <CircularProgress />
                          <Typography variant="body2" color="text.secondary">
                            Loading expenses...
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <ReceiptIcon
                            sx={{ fontSize: 60, color: 'grey.300', mb: 2 }}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            No expenses found
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Add your first expense to get started
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((expense) => (
                        <TableRow
                          key={expense._id || expense.id}
                          hover
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  component="span"
                                  variant="body2"
                                  fontWeight="bold"
                                  sx={{ display: 'inline' }}
                                >
                                  {expense.title}
                                </Typography>
                              </Box>
                              {expense.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 200,
                                  }}
                                >
                                  {expense.description}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                <span>
                                  {getCategoryIcon(expense.category)}
                                </span>
                              }
                              label={
                                isMobile
                                  ? ''
                                  : getCategoryInfo(expense.category).label
                              }
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 1,
                                borderColor: getCategoryInfo(expense.category)
                                  .color,
                                color: getCategoryInfo(expense.category).color,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{ color: 'error.main' }}
                              >
                                -₹{expense.amount.toLocaleString()}
                              </Typography>
                              {expense.isBusinessExpense &&
                                expense.gstAmount > 0 && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    +₹{expense.gstAmount} GST
                                  </Typography>
                                )}
                            </Box>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Box sx={{ color: 'primary.main' }}>
                                  <PaymentIcon method={expense.paymentMethod} />
                                </Box>
                                <Typography variant="body2">
                                  {getPaymentMethodInfo(expense.paymentMethod).label}
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          {!isMobile && (
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <CalendarIcon
                                  fontSize="small"
                                  sx={{ color: 'text.secondary' }}
                                />
                                <Typography variant="body2">
                                  {new Date(expense.date).toLocaleDateString(
                                    'en-US',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    },
                                  )}
                                </Typography>
                              </Box>
                            </TableCell>
                          )}
                          <TableCell>
                            <Chip
                              label={
                                expense.isBusinessExpense
                                  ? 'Business'
                                  : 'Personal'
                              }
                              color={
                                expense.isBusinessExpense
                                  ? 'primary'
                                  : 'default'
                              }
                              size="small"
                              sx={{
                                borderRadius: 1,
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'center',
                              }}
                            >
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => onEditExpense(expense)}
                                  sx={{
                                    borderRadius: 1,
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.100' },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    onDeleteExpense(
                                      expense._id || expense.id!,
                                    )
                                  }
                                  sx={{
                                    borderRadius: 1,
                                    bgcolor: 'error.50',
                                    color: 'error.main',
                                    '&:hover': { bgcolor: 'error.100' },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={expenses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                mt: 2,
              }}
            />
          </>
        )}

        {/* Statistics Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {stats ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                }}
              >
                {/* Category Breakdown */}
                <Card sx={{ flex: 1, borderRadius: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        color: 'text.primary',
                      }}
                    >
                      <CategoryIcon color="primary" />
                      Spending by Category
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {stats.categoryStats.map((category) => (
                        <ListItem
                          key={category._id}
                          sx={{
                            py: 2,
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: getCategoryInfo(category._id).color,
                                width: 40,
                                height: 40,
                              }}
                            >
                              {getCategoryIcon(category._id)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {getCategoryInfo(category._id).label}
                              </Typography>
                            }
                            secondary={`₹${category.totalAmount.toLocaleString()} • ${category.count} expenses`}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            {(
                              (category.totalAmount /
                                stats.categoryStats.reduce(
                                  (sum, cat) => sum + cat.totalAmount,
                                  0,
                                )) *
                              100
                            ).toFixed(1)}
                            %
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Payment Method Distribution */}
                <Card sx={{ flex: 1, borderRadius: 3 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        color: 'text.primary',
                      }}
                    >
                      <CreditCardIcon color="primary" />
                      Payment Methods
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {stats.paymentStats.map((method) => (
                        <ListItem
                          key={method._id}
                          sx={{
                            py: 2,
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: 'primary.50',
                                color: 'primary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <PaymentIcon method={method._id} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {getPaymentMethodInfo(method._id).label}
                              </Typography>
                            }
                            secondary={`₹${method.totalAmount.toLocaleString()} • ${method.count} transactions`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Loading statistics...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Categories Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {expenseCategories.map((category) => (
                <CategoryCard
                  key={category.value}
                  category={category}
                  totalAmount={totalAmount}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ExpenseTabs;