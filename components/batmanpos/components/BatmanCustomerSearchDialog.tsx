// components/batmanpos/components/BatmanCustomerSearchDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Card, Typography, Button, Avatar, Stack, InputAdornment, IconButton, Chip, useTheme } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, Person as PersonIcon } from "@mui/icons-material";
import { batmanColors } from '../types';

interface Customer { _id: string; name: string; phone: string; email?: string; company?: string; address?: string; city?: string; state?: string; pincode?: string; gstin?: string; }

interface BatmanCustomerSearchDialogProps { open: boolean; searchTerm: string; searchResults: Customer[]; onClose: () => void; onSearchChange: (term: string) => void; onSelectCustomer: (customer: Customer) => void; }

export const BatmanCustomerSearchDialog: React.FC<BatmanCustomerSearchDialogProps> = ({ open, searchTerm, searchResults, onClose, onSearchChange, onSelectCustomer }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: batmanColors.surface, border: `2px solid ${batmanColors.gold}` } }}>
      <DialogTitle sx={{ p: 3, pb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 800, color: batmanColors.gold, borderBottom: `2px solid ${batmanColors.gold}`, letterSpacing: '0.05em' }}>Search Citizen 🔍</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField fullWidth placeholder="Search by name, phone, or email..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: batmanColors.gold }} /></InputAdornment>, endAdornment: searchTerm && <InputAdornment position="end"><IconButton size="small" onClick={() => onSearchChange('')}><CloseIcon /></IconButton></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: batmanColors.surface2, '& fieldset': { borderColor: batmanColors.border } } }} sx={{ mb: 2 }} autoFocus />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((cust, index) => (
            <Card key={index} sx={{ mb: 1, p: 2, borderRadius: '12px', backgroundColor: batmanColors.surface2, border: `2px solid ${batmanColors.border}`, cursor: "pointer", '&:hover': { backgroundColor: batmanColors.goldSoft, borderColor: batmanColors.gold } }} onClick={() => onSelectCustomer(cust)}>
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ width: 48, height: 48, backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }}><PersonIcon /></Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: batmanColors.gold }}>{cust.name}</Typography>
                  <Typography variant="body2" sx={{ color: batmanColors.inkSub }}>📞 {cust.phone} {cust.email && `• ✉️ ${cust.email}`}</Typography>
                  {cust.company && <Typography variant="body2" sx={{ color: batmanColors.inkSub, mt: 0.5 }}>🏢 {cust.company}</Typography>}
                  {cust.gstin && <Chip label={`GST: ${cust.gstin}`} size="small" sx={{ mt: 1, backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }} />}
                </Box>
              </Stack>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: batmanColors.goldSoft, color: batmanColors.gold }}><PersonIcon sx={{ fontSize: 32 }} /></Avatar>
              <Typography variant="body1" sx={{ color: batmanColors.gold, mb: 1 }}>No citizens found</Typography>
              <Typography variant="caption" sx={{ color: batmanColors.inkSub }}>Try adjusting your search for "{searchTerm}" - The night is dark but full of terrors!</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2, borderTop: `2px solid ${batmanColors.gold}` }}><Button onClick={onClose} sx={{ borderRadius: '20px', px: 3, py: 0.75, color: batmanColors.inkSub }}>Cancel</Button></DialogActions>
    </Dialog>
  );
};