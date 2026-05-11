// components/dppos/components/DpCustomerSearchDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Card, Typography, Button, Avatar, Stack, InputAdornment, IconButton, Chip, useTheme } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, Person as PersonIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface Customer { _id: string; name: string; phone: string; email?: string; company?: string; address?: string; city?: string; state?: string; pincode?: string; gstin?: string; }

interface DpCustomerSearchDialogProps { open: boolean; searchTerm: string; searchResults: Customer[]; onClose: () => void; onSearchChange: (term: string) => void; onSelectCustomer: (customer: Customer) => void; }

export const DpCustomerSearchDialog: React.FC<DpCustomerSearchDialogProps> = ({ open, searchTerm, searchResults, onClose, onSearchChange, onSelectCustomer }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}` } }}>
      <DialogTitle sx={{ p: 3, pb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 800, color: dpColors.red, borderBottom: `2px solid ${dpColors.border}` }}>Search Customer 🔍</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField fullWidth placeholder="Search by name, phone, or email..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>, endAdornment: searchTerm && <InputAdornment position="end"><IconButton size="small" onClick={() => onSearchChange('')}><CloseIcon /></IconButton></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: dpColors.surface2, '& fieldset': { borderColor: dpColors.border } } }} sx={{ mb: 2 }} autoFocus />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((cust, index) => (
            <Card key={index} sx={{ mb: 1, p: 2, borderRadius: '12px', backgroundColor: dpColors.surface2, border: `2px solid ${dpColors.border}`, cursor: "pointer", '&:hover': { backgroundColor: dpColors.redSoft, borderColor: dpColors.red } }} onClick={() => onSelectCustomer(cust)}>
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ width: 48, height: 48, backgroundColor: dpColors.redSoft, color: dpColors.red }}><PersonIcon /></Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: dpColors.ink }}>{cust.name}</Typography>
                  <Typography variant="body2" sx={{ color: dpColors.inkSub }}>📞 {cust.phone} {cust.email && `• ✉️ ${cust.email}`}</Typography>
                  {cust.company && <Typography variant="body2" sx={{ color: dpColors.inkSub, mt: 0.5 }}>🏢 {cust.company}</Typography>}
                  {cust.gstin && <Chip label={`GST: ${cust.gstin}`} size="small" sx={{ mt: 1, backgroundColor: dpColors.redSoft, color: dpColors.red }} />}
                </Box>
              </Stack>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: dpColors.redSoft, color: dpColors.red }}><PersonIcon sx={{ fontSize: 32 }} /></Avatar>
              <Typography variant="body1" sx={{ color: dpColors.ink, mb: 1 }}>No customers found - Maximum effort!</Typography>
              <Typography variant="caption" sx={{ color: dpColors.inkSub }}>Try adjusting your search for "{searchTerm}"</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2, borderTop: `2px solid ${dpColors.border}` }}><Button onClick={onClose} sx={{ borderRadius: '20px', px: 3, py: 0.75, color: dpColors.inkSub }}>Cancel</Button></DialogActions>
    </Dialog>
  );
};