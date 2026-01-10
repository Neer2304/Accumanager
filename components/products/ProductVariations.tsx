// components/products/ProductVariations.tsx
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

interface ProductVariationsProps {
  data: any
  onChange: (data: any) => void
}

export default function ProductVariations({ data, onChange }: ProductVariationsProps) {
  const variations = data.variations || []

  const addVariation = () => {
    const newVariation = {
      id: `var_${Date.now()}`,
      sku: `${data.name?.substring(0, 3).toUpperCase() || 'PRO'}_${variations.length + 1}`,
      size: '',
      color: '',
      material: '',
      weight: 0,
      unit: 'g',
      price: data.basePrice || 0,
      costPrice: data.baseCostPrice || 0,
      stock: 0,
      minStock: 0,
      maxStock: 100,
      barcode: '',
      images: [],
      isActive: true
    }
    
    onChange({ variations: [...variations, newVariation] })
  }

  const updateVariation = (index: number, field: string, value: any) => {
    const updatedVariations = [...variations]
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value
    }
    onChange({ variations: updatedVariations })
  }

  const removeVariation = (index: number) => {
    const updatedVariations = variations.filter((_: any, i: number) => i !== index)
    onChange({ variations: updatedVariations })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Product Variations
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={addVariation}
          variant="outlined"
        >
          Add Variation
        </Button>
      </Box>

      {variations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" gutterBottom>
              No variations added yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add variations for different sizes, colors, or materials
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {variations.map((variation: any, index: number) => (
            <Grid item xs={12} key={variation.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Variation #{index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => removeVariation(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="SKU"
                        value={variation.sku || ''}
                        onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Barcode"
                        value={variation.barcode || ''}
                        onChange={(e) => updateVariation(index, 'barcode', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Size"
                        value={variation.size || ''}
                        onChange={(e) => updateVariation(index, 'size', e.target.value)}
                        placeholder="S, M, L, XL"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Color"
                        value={variation.color || ''}
                        onChange={(e) => updateVariation(index, 'color', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Material"
                        value={variation.material || ''}
                        onChange={(e) => updateVariation(index, 'material', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Weight"
                        type="number"
                        value={variation.weight || 0}
                        onChange={(e) => updateVariation(index, 'weight', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Price (₹)"
                        type="number"
                        value={variation.price || 0}
                        onChange={(e) => updateVariation(index, 'price', parseFloat(e.target.value) || 0)}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Cost Price (₹)"
                        type="number"
                        value={variation.costPrice || 0}
                        onChange={(e) => updateVariation(index, 'costPrice', parseFloat(e.target.value) || 0)}
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Stock"
                        type="number"
                        value={variation.stock || 0}
                        onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value) || 0)}
                        required
                        inputProps={{ min: 0 }}
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