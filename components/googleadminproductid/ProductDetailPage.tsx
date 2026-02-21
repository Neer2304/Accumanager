// components/googleadminproductid/ProductDetailPage.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  useTheme,
  Fade
} from '@mui/material';

// Import components
import { ProductHeader } from './components/ProductHeader';
import { ProductStatusBadges } from './components/ProductStatusBadges';
import { ProductInfoCard } from './components/ProductInfoCard';
import { ProductQuickStats } from './components/ProductQuickStats';
import { ProductTabs } from './components/ProductTabs';
import { ProductOverviewTab } from './components/ProductOverviewTab';
import { ProductVariationsTab } from './components/ProductVariationsTab';
import { ProductBatchesTab } from './components/ProductBatchesTab';
import { ProductGSTTab } from './components/ProductGSTTab';
import { ProductActionButtons } from './components/ProductActionButtons';
import { ProductLoadingState } from './components/ProductLoadingState';
import { ProductErrorState } from './components/ProductErrorState';
import { ProductNotFound } from './components/ProductNotFound';

// Import hooks
import { useProductDetail } from './hooks/useProductDetail';

export default function ProductDetailPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  
  const {
    product,
    loading,
    error,
    activeTab,
    totalStock,
    fetchProduct,
    handleEdit,
    handleBack,
    handleTabChange,
    formatCurrency,
    getStockStatus,
  } = useProductDetail();

  // Render loading state
  if (loading) {
    return <ProductLoadingState />;
  }

  // Render error state
  if (error) {
    return <ProductErrorState error={error} onRetry={fetchProduct} />;
  }

  // Render not found state
  if (!product) {
    return <ProductNotFound onBack={handleBack} />;
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'variations':
        return (
          <ProductVariationsTab
            product={product}
            formatCurrency={formatCurrency}
            getStockStatus={getStockStatus}
          />
        );
      case 'batches':
        return (
          <ProductBatchesTab
            product={product}
            formatCurrency={formatCurrency}
          />
        );
      case 'gst':
        return (
          <ProductGSTTab
            product={product}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return (
          <ProductOverviewTab
            product={product}
            totalStock={totalStock}
            formatCurrency={formatCurrency}
            getStockStatus={getStockStatus}
          />
        );
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: darkMode ? '#202124' : '#f8f9fa',
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <ProductHeader
          onBack={handleBack}
          onRefresh={fetchProduct}
          onEdit={handleEdit}
          loading={loading}
        />

        {/* Status Badges */}
        <ProductStatusBadges product={product} />

        {/* Main Info Card */}
        <ProductInfoCard
          product={product}
          totalStock={totalStock}
          formatCurrency={formatCurrency}
          getStockStatus={getStockStatus}
        />

        {/* Quick Stats */}
        <Box sx={{ mt: 3 }}>
          <ProductQuickStats product={product} />
        </Box>

        {/* Tabs Navigation */}
        <Box sx={{ mt: 3 }}>
          <ProductTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            product={product}
          />
        </Box>

        {/* Tab Content with Fade Animation */}
        <Fade in key={activeTab} timeout={300}>
          <Box sx={{ animation: 'fadeIn 0.3s ease-in' }}>
            {renderTabContent()}
          </Box>
        </Fade>

        {/* Action Buttons */}
        <ProductActionButtons
          onPrint={() => window.print()}
          onExport={() => {
            // Handle export logic
            console.log('Export product');
          }}
          onShare={() => {
            // Handle share logic
            console.log('Share product');
          }}
        />
      </Container>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}