"use client";

import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Folder as FolderIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { Event } from "../types";
import { formatCurrency } from "../utils";

// Import Google-themed components
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onAddSubEvent: () => void;
  onAddExpense: () => void;
  darkMode?: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  event,
  onAddSubEvent,
  onAddExpense,
  darkMode = false,
}) => {
  const theme = useTheme();
  const budgetRemaining = event.totalBudget - event.totalSpent;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 280,
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          color: darkMode ? '#e8eaed' : '#202124',
        }
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: darkMode ? '1px solid #3c4043' : '1px solid #dadce0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: darkMode ? '#303134' : '#f8f9fa',
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
          Event Actions
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            color: darkMode ? '#e8eaed' : '#202124',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.08)' : 'rgba(26, 115, 232, 0.04)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            onAddSubEvent();
            onClose();
          }}
          fullWidth
          size="large"
          iconLeft={<FolderIcon />}
          sx={{ 
            mb: 2,
            backgroundColor: '#4285f4',
            '&:hover': { backgroundColor: '#3367d6' },
            borderRadius: '12px',
          }}
        >
          Add Sub-Event
        </Button>
        
        <Button
          variant="contained"
          onClick={() => {
            onAddExpense();
            onClose();
          }}
          fullWidth
          size="large"
          iconLeft={<ReceiptIcon />}
          sx={{ 
            mb: 3,
            backgroundColor: '#34a853',
            '&:hover': { backgroundColor: '#2d9248' },
            borderRadius: '12px',
          }}
        >
          Add Expense
        </Button>
        
        <Divider sx={{ 
          my: 2, 
          borderColor: darkMode ? '#3c4043' : '#dadce0' 
        }} />
        
        <Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 2, 
              color: darkMode ? '#9aa0a6' : '#5f6368',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Quick Stats
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 2,
            mb: 3 
          }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              borderRadius: '8px',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Total Budget
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight="bold"
                sx={{ color: darkMode ? '#e8eaed' : '#202124' }}
              >
                {formatCurrency(event.totalBudget)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 1.5, 
              bgcolor: darkMode ? '#303134' : '#f8f9fa',
              borderRadius: '8px',
              border: darkMode ? '1px solid #3c4043' : '1px solid #dadce0',
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: darkMode ? '#9aa0a6' : '#5f6368',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Spent Amount
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight="bold"
                color="#fbbc04"
              >
                {formatCurrency(event.totalSpent)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: budgetRemaining < 0 
              ? (darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)')
              : (darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)'),
            borderRadius: '12px',
            border: `1px solid ${
              budgetRemaining < 0 
                ? (darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.15)')
                : (darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.15)')
            }`,
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368',
                display: 'block',
                mb: 0.5,
              }}
            >
              Balance
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              color={budgetRemaining < 0 ? "#ea4335" : "#34a853"}
            >
              {formatCurrency(budgetRemaining)}
            </Typography>
            <Chip
              label={budgetRemaining < 0 ? "Over Budget" : "Within Budget"}
              size="small"
              color={budgetRemaining < 0 ? "error" : "success"}
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};