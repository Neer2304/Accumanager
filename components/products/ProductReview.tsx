// components/products/ProductReview.tsx
import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert
} from '@mui/material'
import { useProducts } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'

interface ProductReviewProps {
  data: any
  onSave: () => void
  isLoading?: boolean
}

export default function ProductReview({ data, onSave, isLoading = false }: ProductReviewProps) {
  const router = useRouter()

  const getGSTLabel = () => {
    switch (data.gstDetails.type) {
      case 'cgst_sgst':
        return `CGST: ${data.gstDetails.cgstRate}% + SGST: ${data.gstDetails.sgstRate}%`
      case 'igst':
        return `IGST: ${data.gstDetails.igstRate}%`
      case 'utgst':
        return `UTGST: ${data.gstDetails.utgstRate}%`
      default:
        return 'No GST'
    }
  }

  const totalStock = data.variations.reduce((sum: number, variation: any) => sum + variation.stock, 0) +
                    data.batches.reduce((sum: number, batch: any) => sum + batch.quantity, 0)

  // Validate required fields
  const isValidProduct = data.name && data.category && data.basePrice > 0 && data.gstDetails.hsnCode

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Product Information
      </Typography>

      {!isValidProduct && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please fill all required fields: Name, Category, Price, and HSN Code
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Typography><strong>Name:</strong> {data.name || 'Not provided'}</Typography>
              <Typography><strong>Category:</strong> {data.category || 'Not provided'}</Typography>
              <Typography><strong>Brand:</strong> {data.brand || 'Not specified'}</Typography>
              <Typography><strong>Base Price:</strong> ₹{data.basePrice || 0}</Typography>
              <Typography><strong>Cost Price:</strong> ₹{data.baseCostPrice || 0}</Typography>
              <Typography><strong>Returnable:</strong> {data.isReturnable ? 'Yes' : 'No'}</Typography>
              {data.isReturnable && (
                <Typography><strong>Return Period:</strong> {data.returnPeriod} days</Typography>
              )}
              <Box sx={{ mt: 1 }}>
                {data.tags?.map((tag: string, index: number) => (
                  <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
                {(!data.tags || data.tags.length === 0) && (
                  <Typography variant="caption" color="text.secondary">
                    No tags added
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* GST Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                GST Information
              </Typography>
              <Typography><strong>HSN Code:</strong> {data.gstDetails?.hsnCode || 'Not provided'}</Typography>
              <Typography><strong>GST Type:</strong> {data.gstDetails?.type?.toUpperCase() || 'Not specified'}</Typography>
              <Typography><strong>Tax Rates:</strong> {getGSTLabel()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Variations Summary */}
        {data.variations && data.variations.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Variations ({data.variations.length})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Variation</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.variations.map((variation: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{variation.sku}</TableCell>
                          <TableCell>
                            {[variation.size, variation.color, variation.material]
                              .filter(Boolean)
                              .join(' / ') || 'Base Variation'}
                          </TableCell>
                          <TableCell>₹{variation.price}</TableCell>
                          <TableCell>{variation.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Batches Summary */}
        {data.batches && data.batches.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Inventory Batches ({data.batches.length})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Batch No.</TableCell>
                        <TableCell>MFG Date</TableCell>
                        <TableCell>EXP Date</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Cost Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.batches.map((batch: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{batch.batchNumber}</TableCell>
                          <TableCell>
                            {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell>
                            {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell>{batch.quantity}</TableCell>
                          <TableCell>₹{batch.costPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Typography><strong>Total Variations:</strong> {data.variations?.length || 0}</Typography>
              <Typography><strong>Total Batches:</strong> {data.batches?.length || 0}</Typography>
              <Typography><strong>Total Stock:</strong> {totalStock} units</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!isValidProduct || isLoading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minWidth: 120
          }}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </Box>
    </Box>
  )
}