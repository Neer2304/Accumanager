import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import {
  AddIcon,
  DeleteIcon,
  InventoryIcon,
} from "@/assets/icons/BillingIcons";

interface BillItem {
  productId: string;
  variationId?: string;
  name: string;
  variationName?: string;
  hsnCode: string;
  price: number;
  quantity: number;
  discount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
}

interface BillItemsTableProps {
  items: BillItem[];
  isInterState: boolean;
  onAddProduct: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: any) => void;
  onRemoveItem: (index: number) => void;
  isOnline: boolean;
  isSubscriptionActive?: boolean;
}

export const BillItemsTable: React.FC<BillItemsTableProps> = ({
  items,
  isInterState,
  onAddProduct,
  onUpdateItem,
  onRemoveItem,
  isOnline,
  isSubscriptionActive,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">
            Bill Items ({items.length})
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={onAddProduct}
            variant="contained"
            disabled={!isOnline && !isSubscriptionActive}
          >
            Add Product
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>HSN</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Disc%</TableCell>
                <TableCell>Taxable</TableCell>
                <TableCell>GST</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {item.name}
                    </Typography>
                    {item.variationName && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.variationName}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{item.hsnCode}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        onUpdateItem(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      size="small"
                      sx={{ width: 70 }}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        onUpdateItem(
                          index,
                          "discount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      size="small"
                      sx={{ width: 70 }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    ₹{item.taxableAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {isInterState ? (
                      <Typography variant="caption" display="block">
                        IGST: ₹{item.igstAmount.toFixed(2)}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="caption" display="block">
                          CGST: ₹{item.cgstAmount.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" display="block">
                          SGST: ₹{item.sgstAmount.toFixed(2)}
                        </Typography>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="600">
                      ₹{item.total.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => onRemoveItem(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {items.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No items in bill
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click "Add Product" to start adding items
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};