import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  Button,
} from '@mui/material';
import { MoreVert, Phone, Email, Business, LocationOn, Receipt, Person } from '@mui/icons-material';
import { Customer } from './types';

interface CustomerTableProps {
  customers: Customer[];
  searchTerm: string;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, customer: Customer) => void;
  onAddClick: () => void;
  isMobile: boolean;
  isDesktop: boolean;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  searchTerm,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onMenuClick,
  onAddClick,
  isMobile,
  isDesktop,
}) => {
  const theme = useTheme();
  const filteredCustomers = customers; // 这里应该是过滤后的客户列表
  
  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 获取头像颜色
  const getAvatarColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            {!isMobile && <TableCell>Contact</TableCell>}
            <TableCell>Business</TableCell>
            {isDesktop && <TableCell>Location</TableCell>}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 3 : 5} align="center" sx={{ py: 6 }}>
                <EmptyState 
                  searchTerm={searchTerm}
                  onAddClick={onAddClick}
                  isMobile={isMobile}
                />
              </TableCell>
            </TableRow>
          ) : (
            paginatedCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>
                  <CustomerAvatarRow customer={customer} isMobile={isMobile} />
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    <ContactInfo customer={customer} />
                  </TableCell>
                )}
                <TableCell>
                  <BusinessInfo customer={customer} isMobile={isMobile} />
                </TableCell>
                {isDesktop && (
                  <TableCell>
                    <LocationInfo customer={customer} />
                  </TableCell>
                )}
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuClick(e, customer)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, page) => onPageChange(page)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </TableContainer>
  );
};

// 辅助子组件
const CustomerAvatarRow: React.FC<{ customer: Customer; isMobile: boolean }> = ({ customer, isMobile }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar>
      {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </Avatar>
    <Box>
      <Typography variant="subtitle2" fontWeight="bold">
        {customer.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Phone sx={{ fontSize: 12 }} />
        <Typography variant="caption">{customer.phone}</Typography>
      </Box>
    </Box>
  </Box>
);

const ContactInfo: React.FC<{ customer: Customer }> = ({ customer }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Phone sx={{ fontSize: 14 }} />
      <Typography>{customer.phone}</Typography>
    </Box>
    {customer.email && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Email sx={{ fontSize: 14 }} />
        <Typography variant="body2">{customer.email}</Typography>
      </Box>
    )}
  </Box>
);

const BusinessInfo: React.FC<{ customer: Customer; isMobile: boolean }> = ({ customer, isMobile }) => (
  <Box>
    {customer.company && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Business sx={{ fontSize: 14 }} />
        <Typography variant={isMobile ? "caption" : "body2"}>{customer.company}</Typography>
      </Box>
    )}
    <Chip
      label={customer.isInterState ? 'Inter-State' : 'Intra-State'}
      color={customer.isInterState ? 'primary' : 'default'}
      size="small"
    />
  </Box>
);

const LocationInfo: React.FC<{ customer: Customer }> = ({ customer }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <LocationOn sx={{ fontSize: 14 }} />
      <Typography>{customer.city || customer.state}</Typography>
    </Box>
    {customer.gstin && (
      <Typography variant="caption">GST: {customer.gstin}</Typography>
    )}
  </Box>
);

const EmptyState: React.FC<{ searchTerm: string; onAddClick: () => void; isMobile: boolean }> = ({
  searchTerm,
  onAddClick,
  isMobile,
}) => (
  <Box sx={{ textAlign: 'center' }}>
    <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {searchTerm ? 'No customers found' : 'No customers yet'}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {searchTerm ? 'Try different search terms' : 'Add your first customer to get started'}
    </Typography>
    {!searchTerm && (
      <Button
        variant="contained"
        startIcon={<Person />}
        onClick={onAddClick}
        sx={{ mt: 2 }}
        size={isMobile ? "small" : "medium"}
      >
        Add First Customer
      </Button>
    )}
  </Box>
);