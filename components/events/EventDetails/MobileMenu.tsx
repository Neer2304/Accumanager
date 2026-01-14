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
} from "@mui/material";
import {
  Close as CloseIcon,
  Folder as FolderIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { Event } from "../types";
import { formatCurrency } from "../utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onAddSubEvent: () => void;
  onAddExpense: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  event,
  onAddSubEvent,
  onAddExpense,
}) => {
  const budgetRemaining = event.totalBudget - event.totalSpent;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 280,
          p: 2,
        }
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6" fontWeight="bold">
          Event Actions
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        <ListItem 
          button 
          onClick={onAddSubEvent}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Add Sub-Event" />
        </ListItem>
        
        <ListItem 
          button 
          onClick={onAddExpense}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Add Expense" />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem>
          <ListItemText 
            primary="Quick Stats"
            secondary={
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Budget</Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {formatCurrency(event.totalBudget)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Spent</Typography>
                  <Typography variant="caption" fontWeight="bold" color="primary.main">
                    {formatCurrency(event.totalSpent)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Balance</Typography>
                  <Typography 
                    variant="caption" 
                    fontWeight="bold" 
                    color={budgetRemaining < 0 ? "error.main" : "success.main"}
                  >
                    {formatCurrency(budgetRemaining)}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
      </List>
    </Drawer>
  );
};