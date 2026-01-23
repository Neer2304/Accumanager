import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  Typography,
  Button,
} from "@mui/material";
import { SearchIcon } from "@/assets/icons/BillingIcons";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

interface CustomerSearchDialogProps {
  open: boolean;
  searchTerm: string;
  searchResults: Customer[];
  onClose: () => void;
  onSearchChange: (term: string) => void;
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerSearchDialog: React.FC<CustomerSearchDialogProps> = ({
  open,
  searchTerm,
  searchResults,
  onClose,
  onSearchChange,
  onSelectCustomer,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Search Customer</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ mb: 2 }}
          autoFocus
        />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((cust, index) => (
            <Card
              key={index}
              sx={{
                mb: 1,
                p: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => onSelectCustomer(cust)}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {cust.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📞 {cust.phone} {cust.email && `• ✉️ ${cust.email}`}
                </Typography>
                {cust.company && (
                  <Typography variant="body2" color="text.secondary">
                    🏢 {cust.company}
                  </Typography>
                )}
                {cust.address && (
                  <Typography variant="caption" color="text.secondary">
                    📍 {cust.address}, {cust.city}
                  </Typography>
                )}
              </Box>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && ( // Fixed: changed customerSearchTerm to searchTerm
            <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
              No customers found for "{searchTerm}"
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};