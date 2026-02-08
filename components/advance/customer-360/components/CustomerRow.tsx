import React from 'react'
import {
  Box,
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material'
import {
  Visibility,
  MoreVert,
} from '@mui/icons-material'
import { formatCurrency } from '@/utils/formatters'

interface CustomerRowProps {
  customer: any
  isMobile: boolean
  currentColors: any
  primaryColor: string
  alpha: any
  isItemSelected: boolean
  isExpanded: boolean
  onSelect: (id: string) => void
  onExpand: (id: string | null) => void
  onViewDetails: (customer: any) => void
}

export default function CustomerRow({
  customer,
  isMobile,
  currentColors,
  primaryColor,
  alpha,
  isItemSelected,
  isExpanded,
  onSelect,
  onExpand,
  onViewDetails
}: CustomerRowProps) {
  return (
    <TableRow 
      hover 
      selected={isItemSelected}
      sx={{
        '&:hover': {
          backgroundColor: currentColors.hover,
        }
      }}
    >
      {!isMobile && (
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={(event) => {
              event.stopPropagation()
              onSelect(customer._id)
            }}
            size={isMobile ? "small" : "medium"}
          />
        </TableCell>
      )}
      
      <TableCell
        onClick={() => onExpand(isExpanded ? null : customer._id)}
        sx={{ 
          cursor: "pointer",
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
              bgcolor: primaryColor,
              fontSize: isMobile ? 12 : 14,
            }}
          >
            {customer.name?.charAt(0) || "C"}
          </Avatar>
          <Box>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              fontWeight="medium"
              sx={{
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                lineHeight: 1.2
              }}
            >
              {customer.name || "Unnamed"}
            </Typography>
            <Typography
              variant="caption"
              color={currentColors.textSecondary}
              sx={{
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                display: 'block'
              }}
            >
              {customer.company || "No company"}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      {!isMobile && (
        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {customer.email && (
              <Typography 
                variant="body2"
                sx={{ fontSize: '0.875rem' }}
              >
                {customer.email}
              </Typography>
            )}
            <Typography 
              variant="body2" 
              color={currentColors.textSecondary}
              sx={{ fontSize: '0.875rem' }}
            >
              {customer.phone || "No phone"}
            </Typography>
          </Box>
        </TableCell>
      )}
      
      <TableCell 
        align="right"
        sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
      >
        <Typography 
          variant={isMobile ? "caption" : "body2"} 
          fontWeight="medium"
        >
          {formatCurrency(customer.totalSpent || 0)}
        </Typography>
        <Typography 
          variant="caption" 
          color={currentColors.textSecondary}
          sx={{ display: 'block' }}
        >
          {customer.totalOrders || 0} orders
        </Typography>
      </TableCell>
      
      {!isMobile && (
        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={customer.customerScore || 0}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: currentColors.chipBackground,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: primaryColor,
                  borderRadius: 3,
                }
              }}
            />
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ 
                minWidth: 40,
                fontSize: '0.875rem'
              }}
            >
              {customer.customerScore || 0}%
            </Typography>
          </Box>
        </TableCell>
      )}
      
      <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
        <Chip
          label={customer.lifecycleStage || "Customer"}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: alpha(primaryColor, 0.1),
            color: primaryColor,
            fontWeight: "medium",
            textTransform: "capitalize",
            border: `1px solid ${alpha(primaryColor, 0.3)}`,
            fontSize: isMobile ? '0.7rem' : '0.75rem',
            height: isMobile ? 24 : 32,
          }}
        />
      </TableCell>
      
      <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={() => onViewDetails(customer)}
              sx={{
                color: primaryColor,
                "&:hover": {
                  bgcolor: alpha(primaryColor, 0.1),
                },
                padding: isMobile ? '4px' : '8px',
              }}
            >
              <Visibility fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>

          {!isMobile && (
            <Tooltip title="More Actions">
              <IconButton 
                size="small" 
                sx={{ 
                  color: currentColors.textSecondary,
                  padding: '8px'
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
    </TableRow>
  )
}