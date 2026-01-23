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
  Chip,
  Button,
} from "@mui/material";
import { SearchIcon } from "@/assets/icons/BillingIcons";

interface SearchProduct {
  _id: string;
  name: string;
  type: string;
  displayName: string;
  price: number;
  variationId?: string;
  hsnCode: string;
  gstDetails: any;
  stock: number;
  category: string;
  brand?: string;
  sku?: string;
}

interface ProductSearchDialogProps {
  open: boolean;
  searchTerm: string;
  searchResults: SearchProduct[];
  isInterState: boolean;
  onClose: () => void;
  onSearchChange: (term: string) => void;
  onSelectProduct: (product: SearchProduct) => void;
}

export const ProductSearchDialog: React.FC<ProductSearchDialogProps> = ({
  open,
  searchTerm,
  searchResults,
  isInterState,
  onClose,
  onSearchChange,
  onSelectProduct,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Search Products</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search products by name, SKU, category, brand, or HSN..."
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
          {searchResults.map((product, index) => (
            <Card
              key={index}
              sx={{
                mb: 1,
                p: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => onSelectProduct(product)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {product.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    HSN: {product.hsnCode} • Stock: {product.stock} • Category: {product.category}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={isInterState ? "IGST" : "CGST+SGST"}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`₹${product.price.toLocaleString()}`}
                      size="small"
                      color="primary"
                    />
                    {product.stock < 10 && (
                      <Chip
                        label="Low Stock"
                        size="small"
                        color="warning"
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" display="block">
                    {product.type === "variation" ? "Variation" : "Product"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
          {searchResults.length === 0 && searchTerm && (
            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ py: 3 }}
            >
              No products found for "{searchTerm}"
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