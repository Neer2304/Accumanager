// components/products/ProductBatches.tsx
import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'

interface ProductBatchesProps {
  data: any
  onChange: (data: any) => void
}

export default function ProductBatches({ data, onChange }: ProductBatchesProps) {
  const batches = data.batches || []

  const addBatch = () => {
    const newBatch = {
      id: `batch_${Date.now()}`,
      batchNumber: `BATCH_${batches.length + 1}`,
      mfgDate: new Date(),
      expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      quantity: 0,
      costPrice: data.baseCostPrice || 0,
      sellingPrice: data.basePrice || 0,
      location: '',
      supplier: '',
      receivedDate: new Date(),
      isActive: true
    }
    
    onChange({ batches: [...batches, newBatch] })
  }

  const updateBatch = (index: number, field: string, value: any) => {
    const updatedBatches = [...batches]
    updatedBatches[index] = {
      ...updatedBatches[index],
      [field]: value
    }
    onChange({ batches: updatedBatches })
  }

  const removeBatch = (index: number) => {
    const updatedBatches = batches.filter((_: any, i: number) => i !== index)
    onChange({ batches: updatedBatches })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Inventory Batches
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={addBatch}
          variant="outlined"
        >
          Add Batch
        </Button>
      </Box>

      {batches.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" gutterBottom>
              No batches added yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add batches to manage inventory with different manufacturing and expiry dates
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {batches.map((batch: any, index: number) => (
            <Grid item xs={12} key={batch.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Batch: {batch.batchNumber}
                    </Typography>
                    <IconButton
                      onClick={() => removeBatch(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Batch Number"
                        value={batch.batchNumber || ''}
                        onChange={(e) => updateBatch(index, 'batchNumber', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={batch.quantity || 0}
                        onChange={(e) => updateBatch(index, 'quantity', parseInt(e.target.value) || 0)}
                        required
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Manufacturing Date"
                        type="date"
                        value={batch.mfgDate ? new Date(batch.mfgDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateBatch(index, 'mfgDate', new Date(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        value={batch.expDate ? new Date(batch.expDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateBatch(index, 'expDate', new Date(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Cost Price (₹)"
                        type="number"
                        value={batch.costPrice || 0}
                        onChange={(e) => updateBatch(index, 'costPrice', parseFloat(e.target.value) || 0)}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Selling Price (₹)"
                        type="number"
                        value={batch.sellingPrice || 0}
                        onChange={(e) => updateBatch(index, 'sellingPrice', parseFloat(e.target.value) || 0)}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={batch.location || ''}
                        onChange={(e) => updateBatch(index, 'location', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Supplier"
                        value={batch.supplier || ''}
                        onChange={(e) => updateBatch(index, 'supplier', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}