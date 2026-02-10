import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  alpha,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
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
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
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

  const CategoryCard = ({ category, totalAmount }: { 
    category: { value: string; label: string; color: string; icon?: string };
    totalAmount: number;
  }) => {
    const categoryExpenses = expenses.filter(e => e.category === category.value);
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = totalAmount > 0 ? (total / totalAmount) * 100 : 0;

    return (
      <Card sx={{ 
        borderRadius: 3, 
        height: '100%', 
        overflow: 'hidden',
        backgroundColor: darkMode ? '#303134' : '#ffffff',
        border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                backgroundColor: category.color,
                width: 48,
                height: 48,
                fontSize: 24,
                color: 'white',
              }}
            >
              {getCategoryIcon(category.value)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                {category.label}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                {categoryExpenses.length} {categoryExpenses.length === 1 ? 'expense' : 'expenses'}
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ color: '#4285f4' }}
          >
            ₹{total.toLocaleString()}
          </Typography>
          {expenses.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
              >
                {percentage.toFixed(1)}% of total
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                  borderRadius: 2,
                  mt: 0.5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: category.color,
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
      <Box sx={{ p: { xs: 1, sm: 2 }, borderBottom: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}` }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 1,
        }}>
          <Button
            variant={activeTab === 0 ? "contained" : "outlined"}
            onClick={() => onTabChange(0)}
            size="small"
            sx={{
              minWidth: 'auto',
              px: 2,
              backgroundColor: activeTab === 0 ? '#4285f4' : 'transparent',
              borderColor: activeTab === 0 ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0',
              color: activeTab === 0 ? 'white' : darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: activeTab === 0 ? '#3367d6' : darkMode ? '#3c4043' : '#f8f9fa',
              }
            }}
          >
            {isMobile ? 'Expenses' : 'All Expenses'}
          </Button>
          
          <Button
            variant={activeTab === 1 ? "contained" : "outlined"}
            onClick={() => onTabChange(1)}
            size="small"
            sx={{
              minWidth: 'auto',
              px: 2,
              backgroundColor: activeTab === 1 ? '#4285f4' : 'transparent',
              borderColor: activeTab === 1 ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0',
              color: activeTab === 1 ? 'white' : darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: activeTab === 1 ? '#3367d6' : darkMode ? '#3c4043' : '#f8f9fa',
              }
            }}
          >
            Statistics
          </Button>
          
          <Button
            variant={activeTab === 2 ? "contained" : "outlined"}
            onClick={() => onTabChange(2)}
            size="small"
            sx={{
              minWidth: 'auto',
              px: 2,
              backgroundColor: activeTab === 2 ? '#4285f4' : 'transparent',
              borderColor: activeTab === 2 ? '#4285f4' : darkMode ? '#3c4043' : '#dadce0',
              color: activeTab === 2 ? 'white' : darkMode ? '#e8eaed' : '#202124',
              '&:hover': {
                backgroundColor: activeTab === 2 ? '#3367d6' : darkMode ? '#3c4043' : '#f8f9fa',
              }
            }}
          >
            Categories
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* All Expenses Tab */}
        {activeTab === 0 && (
          <>
            {/* Expenses Table */}
            <TableContainer
              sx={{
                borderRadius: 2,
                border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                overflow: 'hidden',
                backgroundColor: darkMode ? '#202124' : '#ffffff',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: darkMode ? '#303134' : '#f8f9fa',
                      '& th': {
                        fontWeight: 600,
                        color: darkMode ? '#e8eaed' : '#202124',
                        borderBottomColor: darkMode ? '#3c4043' : '#dadce0',
                        py: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                          <CircularProgress sx={{ color: '#4285f4' }} />
                          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
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
                            sx={{ fontSize: 60, color: darkMode ? '#5f6368' : '#9aa0a6', mb: 2, opacity: 0.5 }}
                          />
                          <Typography
                            variant="h6"
                            sx={{ color: darkMode ? '#e8eaed' : '#202124', mb: 1 }}
                            gutterBottom
                          >
                            No expenses found
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
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
                            '&:hover': { 
                              backgroundColor: darkMode 
                                ? alpha('#4285f4', 0.05)
                                : alpha('#4285f4', 0.02),
                            },
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
                                  sx={{ 
                                    display: 'inline',
                                    color: darkMode ? '#e8eaed' : '#202124',
                                  }}
                                >
                                  {expense.title}
                                </Typography>
                              </Box>
                              {expense.description && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 200,
                                    color: darkMode ? '#9aa0a6' : '#5f6368',
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
                                borderColor: getCategoryInfo(expense.category).color,
                                color: getCategoryInfo(expense.category).color,
                                backgroundColor: alpha(getCategoryInfo(expense.category).color, darkMode ? 0.2 : 0.1),
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
                                sx={{ color: '#ea4335' }}
                              >
                                -₹{expense.amount.toLocaleString()}
                              </Typography>
                              {expense.isBusinessExpense &&
                                expense.gstAmount > 0 && (
                                  <Typography
                                    variant="caption"
                                    sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
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
                                <Box sx={{ color: '#4285f4' }}>
                                  <PaymentIcon method={expense.paymentMethod} />
                                </Box>
                                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                                  sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}
                                />
                                <Typography variant="body2" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
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
                              size="small"
                              sx={{
                                borderRadius: 1,
                                fontWeight: 500,
                                backgroundColor: expense.isBusinessExpense
                                  ? alpha('#34a853', darkMode ? 0.2 : 0.1)
                                  : alpha('#4285f4', darkMode ? 0.2 : 0.1),
                                color: expense.isBusinessExpense
                                  ? '#34a853'
                                  : '#4285f4',
                                border: `1px solid ${expense.isBusinessExpense
                                  ? alpha('#34a853', 0.3)
                                  : alpha('#4285f4', 0.3)}`,
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
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => onEditExpense(expense)}
                                iconLeft={<EditIcon />}
                                sx={{
                                  minWidth: 'auto',
                                  p: 0.5,
                                  color: '#4285f4',
                                  '&:hover': {
                                    backgroundColor: alpha('#4285f4', darkMode ? 0.1 : 0.05),
                                  }
                                }}
                              >
                                {isMobile ? '' : 'Edit'}
                              </Button>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() =>
                                  onDeleteExpense(
                                    expense._id || expense.id!,
                                  )
                                }
                                iconLeft={<DeleteIcon />}
                                sx={{
                                  minWidth: 'auto',
                                  p: 0.5,
                                  color: '#ea4335',
                                  '&:hover': {
                                    backgroundColor: alpha('#ea4335', darkMode ? 0.1 : 0.05),
                                  }
                                }}
                              >
                                {isMobile ? '' : 'Delete'}
                              </Button>
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
                borderTop: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                mt: 2,
                color: darkMode ? '#e8eaed' : '#202124',
                '& .MuiTablePagination-select, & .MuiTablePagination-selectIcon': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
                '& .MuiSvgIcon-root': {
                  color: darkMode ? '#e8eaed' : '#202124',
                },
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
                <Card sx={{ 
                  flex: 1, 
                  borderRadius: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    >
                      <CategoryIcon sx={{ color: '#4285f4' }} />
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
                            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            '&:hover': { 
                              backgroundColor: darkMode 
                                ? alpha('#4285f4', 0.05)
                                : alpha('#4285f4', 0.02),
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                backgroundColor: getCategoryInfo(category._id).color,
                                width: 40,
                                height: 40,
                                color: 'white',
                              }}
                            >
                              {getCategoryIcon(category._id)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {getCategoryInfo(category._id).label}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                ₹{category.totalAmount.toLocaleString()} • {category.count} expenses
                              </Typography>
                            }
                          />
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ color: '#4285f4' }}
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
                <Card sx={{ 
                  flex: 1, 
                  borderRadius: 3,
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        color: darkMode ? '#e8eaed' : '#202124',
                      }}
                    >
                      <CreditCardIcon sx={{ color: '#4285f4' }} />
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
                            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            '&:hover': { 
                              backgroundColor: darkMode 
                                ? alpha('#4285f4', 0.05)
                                : alpha('#4285f4', 0.02),
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                backgroundColor: alpha('#4285f4', darkMode ? 0.2 : 0.1),
                                color: '#4285f4',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <PaymentIcon method={method._id} />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                                {getPaymentMethodInfo(method._id).label}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
                                ₹{method.totalAmount.toLocaleString()} • {method.count} transactions
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#4285f4' }} />
                <Typography
                  variant="body2"
                  sx={{ 
                    mt: 2,
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
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
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                '& > *': {
                  flex: '1 1 calc(100% - 12px)',
                  minWidth: 0,
                  '@media (min-width: 600px)': {
                    flex: '1 1 calc(50% - 16px)'
                  },
                  '@media (min-width: 900px)': {
                    flex: '1 1 calc(33.333% - 18px)'
                  },
                  '@media (min-width: 1200px)': {
                    flex: '1 1 calc(25% - 18px)'
                  }
                }
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