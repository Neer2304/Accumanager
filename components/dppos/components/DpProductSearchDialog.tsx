// components/dppos/components/DpProductSearchDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Card, Typography, Chip, Button, Avatar, Stack, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import { dpColors } from '../types';

interface SearchProduct { _id: string; name: string; type: string; displayName: string; price: number; variationId?: string; hsnCode: string; gstDetails: any; stock: number; category: string; brand?: string; sku?: string; }

interface DpProductSearchDialogProps { open: boolean; searchTerm: string; searchResults: SearchProduct[]; isInterState: boolean; onClose: () => void; onSearchChange: (term: string) => void; onSelectProduct: (product: SearchProduct) => void; }

export const DpProductSearchDialog: React.FC<DpProductSearchDialogProps> = ({ open, searchTerm, searchResults, isInterState, onClose, onSearchChange, onSelectProduct }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '24px', backgroundColor: dpColors.surface, border: `2px solid ${dpColors.border}` } }}>
      <DialogTitle sx={{ p: 3, pb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 800, color: dpColors.red, borderBottom: `2px solid ${dpColors.border}` }}>Search Products 🔍</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField fullWidth placeholder="Search products by name, SKU, category, brand, or HSN..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: dpColors.red }} /></InputAdornment>, endAdornment: searchTerm && <InputAdornment position="end"><IconButton size="small" onClick={() => onSearchChange('')}><CloseIcon /></IconButton></InputAdornment>, sx: { borderRadius: '12px', backgroundColor: dpColors.surface2 } }} sx={{ mb: 2 }} autoFocus />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {searchResults.map((product, index) => (
            <Card key={index} sx={{ mb: 1, p: 2, borderRadius: '12px', backgroundColor: dpColors.surface2, border: `2px solid ${dpColors.border}`, cursor: "pointer", '&:hover': { backgroundColor: dpColors.redSoft, borderColor: dpColors.red } }} onClick={() => onSelectProduct(product)}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: dpColors.ink }}>{product.displayName}</Typography>
                  <Typography variant="caption" sx={{ color: dpColors.inkSub, display: 'block', mt: 0.5 }}>HSN: {product.hsnCode} • Stock: {product.stock} • Category: {product.category}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label={isInterState ? "IGST" : "CGST+SGST"} size="small" sx={{ backgroundColor: dpColors.redSoft, color: dpColors.red, fontWeight: 700 }} />
                    <Chip label={`₹${product.price.toLocaleString()}`} size="small" sx={{ backgroundColor: dpColors.redSoft, color: dpColors.gold, fontWeight: 700 }} />
                    {product.stock < 10 && <Chip label="Low Stock!" size="small" sx={{ backgroundColor: dpColors.goldSoft, color: dpColors.gold, fontWeight: 700 }} />}
                  </Stack>
                </Box>
                <Box sx={{ textAlign: "right" }}><Chip label={product.type === "variation" ? "Variation" : "Product"} size="small" sx={{ backgroundColor: product.type === "variation" ? dpColors.redSoft : dpColors.surface, color: product.type === "variation" ? dpColors.red : dpColors.inkSub }} /></Box>
              </Stack>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: dpColors.redSoft, color: dpColors.red }}><InventoryIcon sx={{ fontSize: 32 }} /></Avatar>
              <Typography variant="body1" sx={{ color: dpColors.ink, mb: 1 }}>No products found - Maximum effort!</Typography>
              <Typography variant="caption" sx={{ color: dpColors.inkSub }}>Try adjusting your search for "{searchTerm}"</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2, borderTop: `2px solid ${dpColors.border}` }}><Button onClick={onClose} sx={{ borderRadius: '20px', px: 3, py: 0.75, color: dpColors.inkSub }}>Cancel</Button></DialogActions>
    </Dialog>
  );
};