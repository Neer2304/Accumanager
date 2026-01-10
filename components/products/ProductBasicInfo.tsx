// components/products/ProductBasicInfo.tsx
import React from 'react'
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  Typography
} from '@mui/material'

interface ProductBasicInfoProps {
  data: any
  onChange: (data: any) => void
}

const categories = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Books',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Automotive',
  'Toys & Games',
  'Other'
]

const brands = [
  'Nike',
  'Samsung',
  'Apple',
  'Sony',
  'LG',
  'Philips',
  'Puma',
  'Adidas',
  'Microsoft',
  'Other'
]

export default function ProductBasicInfo({ data, onChange }: ProductBasicInfoProps) {
  // Ensure all fields have proper initial values
  const formData = {
    name: data.name || '',
    description: data.description || '',
    category: data.category || '',
    subCategory: data.subCategory || '',
    brand: data.brand || '',
    basePrice: data.basePrice || 0,
    baseCostPrice: data.baseCostPrice || 0,
    tags: data.tags || [],
    isReturnable: data.isReturnable || false,
    returnPeriod: data.returnPeriod || 0,
  }

  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value })
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      onChange({ tags: [...formData.tags, tag] })
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    onChange({ tags: formData.tags.filter((tag: string) => tag !== tagToRemove) })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            SelectProps={{ native: true }}
            required
          >
            <option value=""></option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sub Category"
            value={formData.subCategory}
            onChange={(e) => handleChange('subCategory', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Brand"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Base Price (₹)"
            type="number"
            value={formData.basePrice}
            onChange={(e) => handleChange('basePrice', parseFloat(e.target.value) || 0)}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cost Price (₹)"
            type="number"
            value={formData.baseCostPrice}
            onChange={(e) => handleChange('baseCostPrice', parseFloat(e.target.value) || 0)}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Add Tag"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement
                handleTagAdd(input.value)
                input.value = ''
                e.preventDefault()
              }
            }}
          />
          <Box sx={{ mt: 1 }}>
            {formData.tags.map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleTagRemove(tag)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isReturnable}
                onChange={(e) => handleChange('isReturnable', e.target.checked)}
              />
            }
            label="Product is returnable"
          />
        </Grid>

        {formData.isReturnable && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Return Period (Days)"
              type="number"
              value={formData.returnPeriod}
              onChange={(e) => handleChange('returnPeriod', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}