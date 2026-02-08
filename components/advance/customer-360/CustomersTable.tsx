import React, { useState } from 'react'
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  Button,
} from '@mui/material'
import {
  Visibility,
  MoreVert,
} from '@mui/icons-material'
import CustomerRow from './components/CustomerRow'
import EmptyState from './components/EmptyState'

interface CustomersTableProps {
  customers: any[]
  loading: boolean
  isMobile: boolean
  currentColors: any
  primaryColor: string
  alpha: any
  page: number
  setPage: (page: number) => void
  rowsPerPage: number
  setRowsPerPage: (rows: number) => void
  selected: string[]
  setSelected: (selected: string[]) => void
  expandedRow: string | null
  setExpandedRow: (id: string | null) => void
  search: string
  onInitialize: () => void
  initializing: boolean
  onCustomerSelect: (customer: any) => void
}

export default function CustomersTable({
  customers,
  loading,
  isMobile,
  currentColors,
  primaryColor,
  alpha,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  selected,
  setSelected,
  expandedRow,
  setExpandedRow,
  search,
  onInitialize,
  initializing,
  onCustomerSelect
}: CustomersTableProps) {
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [orderBy, setOrderBy] = useState<string>("customerScore")

  // Get sorted customers
  const sortedCustomers = [...customers].sort((a, b) => {
    if (order === "desc") {
      return (b[orderBy] as any) < (a[orderBy] as any) ? -1 : 1
    }
    return (a[orderBy] as any) < (b[orderBy] as any) ? -1 : 1
  })

  // Filter customers based on search
  const filteredCustomers = sortedCustomers.filter((customer) => {
    if (!customer) return false
    const searchLower = search.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(search) ||
      customer.company?.toLowerCase().includes(searchLower)
    )
  })

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

  // Handle select all
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = customers.map((n) => n._id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  // Handle individual selection
  const handleSelect = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Card sx={{ 
      background: currentColors.card, 
      mb: 2,
      border: `1px solid ${currentColors.border}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      overflow: 'auto',
    }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: isMobile ? 1.5 : 2,
          borderBottom: `1px solid ${currentColors.border}`,
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight="bold"
          fontSize={isMobile ? '1rem' : '1.125rem'}
        >
          Customers ({filteredCustomers.length})
        </Typography>

        {selected.length > 0 && !isMobile && (
          <Box display="flex" gap={1}>
            <Typography 
              variant="body2" 
              color={currentColors.textSecondary}
              fontSize="0.875rem"
            >
              {selected.length} selected
            </Typography>
            <Button 
              size="small" 
              sx={{ fontSize: '0.75rem', px: 1 }}
            >
              Bulk Actions
            </Button>
          </Box>
        )}
      </Box>

      <TableContainer sx={{ maxHeight: isMobile ? 400 : 500 }}>
        <Table size={isMobile ? "small" : "medium"} stickyHeader>
          <TableHead>
            <TableRow>
              {!isMobile && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < customers.length
                    }
                    checked={
                      customers.length > 0 &&
                      selected.length === customers.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              
              <TableCell sx={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: 600
              }}>
                Customer
              </TableCell>
              
              {!isMobile && (
                <TableCell sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: 600
                }}>
                  Contact
                </TableCell>
              )}
              
              <TableCell 
                align="right" 
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: 600
                }}
              >
                Spent
              </TableCell>
              
              {!isMobile && (
                <TableCell sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: 600
                }}>
                  Score
                </TableCell>
              )}
              
              <TableCell sx={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: 600
              }}>
                Status
              </TableCell>
              
              <TableCell sx={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: 600
              }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={isMobile ? 4 : 7} 
                  align="center" 
                  sx={{ 
                    py: 4,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  <EmptyState
                    loading={loading}
                    search={search}
                    onInitialize={onInitialize}
                    initializing={initializing}
                    currentColors={currentColors}
                    isMobile={isMobile}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <CustomerRow
                  key={customer._id}
                  customer={customer}
                  isMobile={isMobile}
                  currentColors={currentColors}
                  primaryColor={primaryColor}
                  alpha={alpha}
                  isItemSelected={selected.includes(customer._id)}
                  isExpanded={expandedRow === customer._id}
                  onSelect={handleSelect}
                  onExpand={setExpandedRow}
                  onViewDetails={onCustomerSelect}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          }
        }}
      />
    </Card>
  )
}