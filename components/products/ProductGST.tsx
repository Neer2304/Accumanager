// components/products/ProductGST.tsx
import React from 'react'
import {
  Box,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Typography
} from '@mui/material'

interface ProductGSTProps {
  data: any
  onChange: (data: any) => void
}

export default function ProductGST({ data, onChange }: ProductGSTProps) {
  // Ensure all GST fields have proper initial values
  const gstData = {
    type: data.gstDetails?.type || 'cgst_sgst',
    hsnCode: data.gstDetails?.hsnCode || '',
    cgstRate: data.gstDetails?.cgstRate || 0,
    sgstRate: data.gstDetails?.sgstRate || 0,
    igstRate: data.gstDetails?.igstRate || 0,
    utgstRate: data.gstDetails?.utgstRate || 0,
  }

  const handleGSTChange = (field: string, value: any) => {
    onChange({
      gstDetails: {
        ...gstData,
        [field]: value
      }
    })
  }

  const handleTypeChange = (type: string) => {
    const newGstDetails = {
      ...gstData,
      type
    }
    
    // Reset rates when type changes
    if (type === 'igst') {
      newGstDetails.cgstRate = 0
      newGstDetails.sgstRate = 0
      newGstDetails.utgstRate = 0
    } else {
      newGstDetails.igstRate = 0
    }
    
    onChange({ gstDetails: newGstDetails })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        GST & Tax Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="HSN Code"
            value={gstData.hsnCode}
            onChange={(e) => handleGSTChange('hsnCode', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">GST Type</FormLabel>
          <RadioGroup
            value={gstData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            row
          >
            <FormControlLabel value="cgst_sgst" control={<Radio />} label="CGST + SGST" />
            <FormControlLabel value="igst" control={<Radio />} label="IGST" />
            <FormControlLabel value="utgst" control={<Radio />} label="UTGST" />
          </RadioGroup>
        </Grid>

        {gstData.type === 'cgst_sgst' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CGST Rate (%)"
                type="number"
                value={gstData.cgstRate}
                onChange={(e) => handleGSTChange('cgstRate', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SGST Rate (%)"
                type="number"
                value={gstData.sgstRate}
                onChange={(e) => handleGSTChange('sgstRate', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>
          </>
        )}

        {gstData.type === 'igst' && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IGST Rate (%)"
              type="number"
              value={gstData.igstRate}
              onChange={(e) => handleGSTChange('igstRate', parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
        )}

        {gstData.type === 'utgst' && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="UTGST Rate (%)"
              type="number"
              value={gstData.utgstRate}
              onChange={(e) => handleGSTChange('utgstRate', parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}