import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Chip,
  Divider,
  Alert,
  LinearProgress,
  useTheme,
  alpha,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Inventory,
  AttachMoney,
  Business,
  LocationOn,
  Schedule,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  History,
  Timeline,
  Receipt,
  Download,
  Share,
  Print,
} from '@mui/icons-material';
import { useMaterials } from './hooks/useMaterials';
import { getStatusColor, getStatusLabel, getCategoryLabel, getUnitLabel } from './types/material.types';
import { MaterialUseDialog } from './components/MaterialUseDialog';
import { MaterialRestockDialog } from './components/MaterialRestockDialog';

export const MaterialDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const {
    currentMaterial,
    loading,
    error,
    fetchMaterial,
    deleteMaterial,
    useMaterial,
    restockMaterial,
    setError,
  } = useMaterials();

  const [activeTab, setActiveTab] = useState(0);
  const [useDialogOpen, setUseDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMaterial(id as string);
    }
  }, [id]);

  const handleEdit = () => {
    if (currentMaterial) {
      router.push(`/materials/${currentMaterial._id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (currentMaterial) {
      try {
        await deleteMaterial(currentMaterial._id);
        router.push('/materials');
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  const handleUse = async (request: any) => {
    try {
      await useMaterial(request);
      fetchMaterial(id as string);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleRestock = async (request: any) => {
    try {
      await restockMaterial(request);
      fetchMaterial(id as string);
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography>Loading material details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!currentMaterial) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Material not found
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/materials')}
          sx={{ mt: 2 }}
        >
          Back to Materials
        </Button>
      </Container>
    );
  }

  const material = currentMaterial;
  const stockPercentage = material.maximumStock 
    ? (material.currentStock / material.maximumStock) * 100 
    : (material.currentStock / (material.minimumStock * 3)) * 100;

  const tabs = [
    { label: 'Overview', icon: <Inventory /> },
    { label: 'Usage History', icon: <History /> },
    { label: 'Restock History', icon: <Timeline /> },
    { label: 'Analytics', icon: <TrendingUp /> },
  ];

  const getStatusIcon = () => {
    switch (material.status) {
      case 'in-stock':
        return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      case 'low-stock':
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'out-of-stock':
        return <Error sx={{ color: theme.palette.error.main }} />;
      default:
        return <Inventory sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(getStatusColor(material.status), 0.1)} 0%, ${alpha(getStatusColor(material.status), 0.05)} 100%)`,
          border: `1px solid ${alpha(getStatusColor(material.status), 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/materials')}
              sx={{ mb: 1 }}
            >
              Back to Materials
            </Button>
            <Typography variant="h4" fontWeight="bold">
              {material.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              SKU: {material.sku} • Last updated: {new Date(material.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<Print />}
              variant="outlined"
              size="small"
            >
              Print
            </Button>
            <Button
              startIcon={<Share />}
              variant="outlined"
              size="small"
            >
              Share
            </Button>
            <Button
              startIcon={<Edit />}
              onClick={handleEdit}
              variant="outlined"
              size="small"
            >
              Edit
            </Button>
            <Button
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
              variant="outlined"
              color="error"
              size="small"
            >
              Delete
            </Button>
          </Stack>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {getStatusIcon()}
                <Typography variant="subtitle2" fontWeight={600}>
                  {getStatusLabel(material.status)}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {material.currentStock} {getUnitLabel(material.unit)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Current Stock
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney sx={{ color: theme.palette.success.main }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Value
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                ${(material.currentStock * material.unitCost).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unit Cost: ${material.unitCost.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Business sx={{ color: theme.palette.info.main }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Category
                </Typography>
              </Box>
              <Chip
                label={getCategoryLabel(material.category)}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOn sx={{ color: theme.palette.warning.main }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Location
                </Typography>
              </Box>
              <Typography variant="body2">
                {material.storageLocation || 'Not specified'}
                {material.shelf && ` • Shelf ${material.shelf}`}
                {material.bin && ` • Bin ${material.bin}`}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            startIcon={<Inventory />}
            onClick={() => setRestockDialogOpen(true)}
            variant="contained"
            color="success"
            size="large"
          >
            Restock Material
          </Button>
          <Button
            startIcon={<Receipt />}
            onClick={() => setUseDialogOpen(true)}
            variant="contained"
            color="error"
            size="large"
            disabled={material.currentStock === 0}
          >
            Use Material
          </Button>
        </Stack>
      </Paper>

      {/* Stock Progress */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Stock Level
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {material.currentStock} / {material.maximumStock || '∞'} {getUnitLabel(material.unit)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={stockPercentage}
          sx={{
            height: 12,
            borderRadius: 6,
            mb: 1,
            backgroundColor: alpha(theme.palette.grey[300], 0.5),
            '& .MuiLinearProgress-bar': {
              backgroundColor: getStatusColor(material.status),
              borderRadius: 6,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Min: {material.minimumStock} {getUnitLabel(material.unit)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {stockPercentage.toFixed(1)}% of capacity
          </Typography>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '& .MuiTab-root': {
              py: 2,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{ minHeight: 60 }}
            />
          ))}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Material Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {material.description || 'No description provided'}
                      </Typography>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Supplier Information
                      </Typography>
                      <Typography variant="body1">
                        {material.supplierName || 'No supplier specified'}
                      </Typography>
                      {material.supplierContact && (
                        <Typography variant="body2" color="text.secondary">
                          Contact: {material.supplierContact}
                        </Typography>
                      )}
                      {material.leadTime && (
                        <Typography variant="body2" color="text.secondary">
                          Lead Time: {material.leadTime} days
                        </Typography>
                      )}
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Additional Information
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {material.batchNumber && (
                          <Chip
                            label={`Batch: ${material.batchNumber}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {material.expirationDate && (
                          <Chip
                            label={`Expires: ${new Date(material.expirationDate).toLocaleDateString()}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Quantity Added
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {material.totalQuantityAdded} {getUnitLabel(material.unit)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total Quantity Used
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {material.totalQuantityUsed} {getUnitLabel(material.unit)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Average Monthly Usage
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {material.averageMonthlyUsage.toFixed(1)} {getUnitLabel(material.unit)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Reorder Point
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {material.reorderPoint} {getUnitLabel(material.unit)}
                      </Typography>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Activity
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {material.lastUsed && (
                          <Typography variant="body2">
                            Last used: {new Date(material.lastUsed).toLocaleDateString()}
                          </Typography>
                        )}
                        {material.lastRestocked && (
                          <Typography variant="body2">
                            Last restocked: {new Date(material.lastRestocked).toLocaleDateString()}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          Total edits: {material.editCount}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Usage History
              </Typography>
              {material.usageHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No usage history recorded yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {material.usageHistory.slice().reverse().map((usage, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Grid container alignItems="center">
                          <Grid item xs={8}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {usage.quantity} {getUnitLabel(material.unit)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Used by {usage.usedBy}
                              {usage.project && ` • Project: ${usage.project}`}
                            </Typography>
                            {usage.note && (
                              <Typography variant="caption" color="text.secondary">
                                Note: {usage.note}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="body2" fontWeight={600}>
                              ${usage.cost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="caption" color="text.secondary" align="right">
                              {new Date(usage.usedAt).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Paper>
          )}

          {activeTab === 2 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Restock History
              </Typography>
              {material.restockHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  No restock history recorded yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {material.restockHistory.slice().reverse().map((restock, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Grid container alignItems="center">
                          <Grid item xs={6}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {restock.quantity} {getUnitLabel(material.unit)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {restock.supplier && `Supplier: ${restock.supplier}`}
                              {restock.purchaseOrder && ` • PO: ${restock.purchaseOrder}`}
                            </Typography>
                            {restock.note && (
                              <Typography variant="caption" color="text.secondary">
                                Note: {restock.note}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2">
                              Unit: ${restock.unitCost.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              Total: ${restock.totalCost.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="caption" color="text.secondary" align="right">
                              {new Date(restock.restockedAt).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Paper>
          )}

          {activeTab === 3 && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Analytics & Trends
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                Analytics dashboard coming soon...
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <MaterialUseDialog
        open={useDialogOpen}
        material={material}
        onClose={() => setUseDialogOpen(false)}
        onSubmit={handleUse}
        loading={loading}
      />

      <MaterialRestockDialog
        open={restockDialogOpen}
        material={material}
        onClose={() => setRestockDialogOpen(false)}
        onSubmit={handleRestock}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Material
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{material.name}"? This action cannot be undone.
          </Typography>
          {material.currentStock > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This material still has {material.currentStock} {material.unit} in stock.
              Deleting it will remove all stock and usage history.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Material'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};