'use client'

import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
  Stack,
  Avatar,
  Chip,
  InputAdornment,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  Event as EventIcon,
} from '@mui/icons-material'

interface ProductBatchesProps {
  data: any
  onChange: (data: any) => void
}

export default function ProductBatches({ data, onChange }: ProductBatchesProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Check if batch is expired
  const isBatchExpired = (expDate: Date) => {
    return new Date(expDate) < new Date();
  }

  // Check if batch is expiring soon (within 30 days)
  const isBatchExpiringSoon = (expDate: Date) => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const exp = new Date(expDate);
    return exp > now && exp <= thirtyDaysFromNow;
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
              color: darkMode ? '#8ab4f8' : '#1a73e8',
            }}
          >
            <InventoryIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Inventory Batches
            </Typography>
            <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }}>
              Manage batch-wise inventory with expiry dates
            </Typography>
          </Box>
        </Stack>
        <Button
          startIcon={<AddIcon />}
          onClick={addBatch}
          variant="contained"
          sx={{
            borderRadius: '28px',
            px: 3,
            py: 1,
            backgroundColor: darkMode ? '#8ab4f8' : '#1a73e8',
            color: darkMode ? '#202124' : '#ffffff',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: darkMode ? '#aecbfa' : '#1669c1',
              boxShadow: darkMode
                ? '0 4px 12px rgba(138, 180, 248, 0.3)'
                : '0 4px 12px rgba(26, 115, 232, 0.3)',
            },
          }}
        >
          Add Batch
        </Button>
      </Stack>

      {batches.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            borderRadius: '16px',
            backgroundColor: darkMode ? '#202124' : '#f8f9fa',
            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              backgroundColor: darkMode ? 'rgba(154, 160, 166, 0.1)' : 'rgba(154, 160, 166, 0.1)',
              color: darkMode ? '#9aa0a6' : '#5f6368',
            }}
          >
            <InventoryIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={500} gutterBottom sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
            No batches added yet
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#9aa0a6' : '#5f6368', mb: 2 }}>
            Add batches to manage inventory with different manufacturing and expiry dates
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addBatch}
            variant="outlined"
            sx={{
              borderRadius: '28px',
              px: 3,
              borderColor: darkMode ? '#3c4043' : '#dadce0',
              color: darkMode ? '#e8eaed' : '#202124',
              textTransform: 'none',
              '&:hover': {
                borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                backgroundColor: darkMode ? 'rgba(138, 180, 248, 0.05)' : 'rgba(26, 115, 232, 0.05)',
                color: darkMode ? '#8ab4f8' : '#1a73e8',
              },
            }}
          >
            Add First Batch
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {batches.map((batch: any, index: number) => {
            const expired = isBatchExpired(batch.expDate);
            const expiringSoon = isBatchExpiringSoon(batch.expDate);

            return (
              <Card
                key={batch.id}
                sx={{
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${
                    expired
                      ? darkMode ? 'rgba(234, 67, 53, 0.5)' : 'rgba(234, 67, 53, 0.3)'
                      : expiringSoon
                      ? darkMode ? 'rgba(251, 188, 4, 0.5)' : 'rgba(251, 188, 4, 0.3)'
                      : darkMode ? '#3c4043' : '#dadce0'
                  }`,
                  boxShadow: 'none',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: darkMode
                      ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: expired
                            ? darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)'
                            : expiringSoon
                            ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)'
                            : darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)',
                          color: expired
                            ? darkMode ? '#f28b82' : '#ea4335'
                            : expiringSoon
                            ? darkMode ? '#fdd663' : '#fbbc04'
                            : darkMode ? '#8ab4f8' : '#1a73e8',
                          fontSize: '0.875rem',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={500} sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
                        Batch: {batch.batchNumber}
                      </Typography>
                      {expired && (
                        <Chip
                          label="Expired"
                          size="small"
                          sx={{
                            backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                            color: darkMode ? '#f28b82' : '#ea4335',
                            border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.3)' : 'rgba(234, 67, 53, 0.2)'}`,
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                      )}
                      {expiringSoon && !expired && (
                        <Chip
                          label="Expiring Soon"
                          size="small"
                          sx={{
                            backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.1)',
                            color: darkMode ? '#fdd663' : '#fbbc04',
                            border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.3)' : 'rgba(251, 188, 4, 0.2)'}`,
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                      )}
                    </Stack>
                    <Tooltip title="Remove batch">
                      <IconButton
                        onClick={() => removeBatch(index)}
                        sx={{
                          color: darkMode ? '#9aa0a6' : '#5f6368',
                          '&:hover': {
                            color: darkMode ? '#f28b82' : '#ea4335',
                            backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Batch Number"
                        placeholder="e.g. BATCH_001"
                        value={batch.batchNumber || ''}
                        onChange={(e) => updateBatch(index, 'batchNumber', e.target.value)}
                        required
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <QrCodeIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        placeholder="0"
                        value={batch.quantity || 0}
                        onChange={(e) => updateBatch(index, 'quantity', parseInt(e.target.value) || 0)}
                        required
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <InventoryIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 },
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Manufacturing Date"
                        type="date"
                        value={batch.mfgDate ? new Date(batch.mfgDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateBatch(index, 'mfgDate', new Date(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        value={batch.expDate ? new Date(batch.expDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateBatch(index, 'expDate', new Date(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Cost Price (₹)"
                        type="number"
                        placeholder="0.00"
                        value={batch.costPrice || 0}
                        onChange={(e) => updateBatch(index, 'costPrice', parseFloat(e.target.value) || 0)}
                        required
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoneyIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0, step: 0.01 },
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Selling Price (₹)"
                        type="number"
                        placeholder="0.00"
                        value={batch.sellingPrice || 0}
                        onChange={(e) => updateBatch(index, 'sellingPrice', parseFloat(e.target.value) || 0)}
                        required
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoneyIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0, step: 0.01 },
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Location"
                        placeholder="e.g. Warehouse A, Shelf 12"
                        value={batch.location || ''}
                        onChange={(e) => updateBatch(index, 'location', e.target.value)}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Supplier"
                        placeholder="e.g. XYZ Distributors"
                        value={batch.supplier || ''}
                        onChange={(e) => updateBatch(index, 'supplier', e.target.value)}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon sx={{ color: darkMode ? '#9aa0a6' : '#5f6368' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '12px',
                            backgroundColor: darkMode ? '#202124' : '#ffffff',
                            border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                            color: darkMode ? '#e8eaed' : '#202124',
                            '&:hover': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              backgroundColor: darkMode ? '#2d2e30' : '#f8f9fa',
                            },
                            '&.Mui-focused': {
                              borderColor: darkMode ? '#8ab4f8' : '#1a73e8',
                              boxShadow: `0 0 0 3px ${darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.1)'}`,
                            },
                          },
                        }}
                      />
                    </Stack>

                    {expired && (
                      <Paper
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                          border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WarningIcon sx={{ fontSize: 16, color: darkMode ? '#f28b82' : '#ea4335' }} />
                          <Typography variant="caption" sx={{ color: darkMode ? '#f28b82' : '#ea4335' }}>
                            This batch has expired. Please remove from inventory.
                          </Typography>
                        </Stack>
                      </Paper>
                    )}

                    {expiringSoon && !expired && (
                      <Paper
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          backgroundColor: darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)',
                          border: `1px solid ${darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'}`,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WarningIcon sx={{ fontSize: 16, color: darkMode ? '#fdd663' : '#fbbc04' }} />
                          <Typography variant="caption" sx={{ color: darkMode ? '#fdd663' : '#fbbc04' }}>
                            This batch is expiring within 30 days. Consider discounting or returning.
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  )
}