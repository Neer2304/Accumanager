// components/dppos/DpPOSPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { DpBillItemsTable } from './components/DpBillItemsTable';
import { DpBusinessDetails } from './components/DpBusinessDetails';
import { DpCustomerDetails } from './components/DpCustomerDetails';
import { DpCustomerSearchDialog } from './components/DpCustomerSearchDialog';
import { DpHeaderSection } from './components/DpHeaderSection';
import { DpInvoiceSummary } from './components/DpInvoiceSummary';
import { DpNetworkStatus } from './components/DpNetworkStatus';
import { DpProductSearchDialog } from './components/DpProductSearchDialog';
import { DpSubscriptionStatus } from './components/DpSubscriptionStatus';
import { dpColors } from './types';

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

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

interface Business {
  businessName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function DpPOSPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isAuthenticated } = useAuth();

  const [items, setItems] = useState<BillItem[]>([]);
  const [customer, setCustomer] = useState({
    name: '', phone: '', email: '', company: '', address: '', city: '', state: '', pincode: '', gstin: '',
    isInterState: false,
  });
  const [business, setBusiness] = useState<Business | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'credit'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineBillsCount, setOfflineBillsCount] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch('/api/business', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setBusiness(data.business);
        }
      } catch (error) { console.error('Error fetching business:', error); }
    };
    fetchBusiness();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSubscription(data.data);
        }
      } catch (error) { console.error('Error fetching subscription:', error); }
    };
    fetchSubscription();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.price * item.quantity * item.discount) / 100, 0);
  const totalTaxableAmount = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const totalCgst = items.reduce((sum, item) => sum + item.cgstAmount, 0);
  const totalSgst = items.reduce((sum, item) => sum + item.sgstAmount, 0);
  const totalIgst = items.reduce((sum, item) => sum + item.igstAmount, 0);
  const grandTotal = totalTaxableAmount + totalCgst + totalSgst + totalIgst;

  const isInterState = customer.state && business?.state ? customer.state !== business.state : false;

  const calculateItemTotals = (item: BillItem): BillItem => {
    const taxableAmount = item.price * item.quantity * (1 - item.discount / 100);
    let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;
    if (isInterState) {
      igstAmount = taxableAmount * 0.09;
    } else {
      cgstAmount = taxableAmount * 0.09;
      sgstAmount = taxableAmount * 0.09;
    }
    const total = taxableAmount + cgstAmount + sgstAmount + igstAmount;
    return { ...item, taxableAmount, cgstAmount, sgstAmount, igstAmount, total };
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updatedItems[index] = calculateItemTotals(updatedItems[index]);
    setItems(updatedItems);
  };

  const addProduct = (product: any) => {
    const newItem: BillItem = {
      productId: product._id,
      variationId: product.variationId,
      name: product.displayName,
      variationName: product.type === 'variation' ? product.name : undefined,
      hsnCode: product.hsnCode,
      price: product.price,
      quantity: 1,
      discount: 0,
      taxableAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      total: 0,
    };
    const calculatedItem = calculateItemTotals(newItem);
    setItems([...items, calculatedItem]);
    setProductSearchOpen(false);
    setSearchTerm('');
  };

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const selectCustomer = (cust: Customer) => {
    setCustomer({
      name: cust.name, phone: cust.phone, email: cust.email || '', company: cust.company || '',
      address: cust.address || '', city: cust.city || '', state: cust.state || '', pincode: cust.pincode || '',
      gstin: cust.gstin || '', isInterState: business?.state ? cust.state !== business.state : false,
    });
    setCustomerSearchOpen(false);
    setCustomerSearchTerm('');
  };

  const searchProducts = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) { setSearchResults([]); return; }
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`, { credentials: 'include' });
      if (response.ok) { const data = await response.json(); setSearchResults(data.products || []); }
    } catch (error) { console.error('Error searching products:', error); }
  };

  const searchCustomers = async (term: string) => {
    setCustomerSearchTerm(term);
    if (term.length < 2) { setCustomerSearchResults([]); return; }
    try {
      const response = await fetch(`/api/customers/search?q=${encodeURIComponent(term)}`, { credentials: 'include' });
      if (response.ok) { const data = await response.json(); setCustomerSearchResults(data.customers || []); }
    } catch (error) { console.error('Error searching customers:', error); }
  };

  const handleConfirmBill = async () => {
    setIsSubmitting(true);
    try {
      const billData = {
        invoiceNumber, invoiceDate, customer, items: items.map(item => ({ productId: item.productId, variationId: item.variationId, quantity: item.quantity, price: item.price, discount: item.discount, hsnCode: item.hsnCode })),
        subtotal, totalDiscount, totalTaxableAmount, totalCgst, totalSgst, totalIgst, grandTotal, paymentMethod, notes, isInterState,
      };
      const response = await fetch('/api/invoices/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(billData) });
      if (response.ok) { const data = await response.json(); window.open(`/invoices/${data.invoiceId}/print`, '_blank'); setItems([]); setCustomer({ name: '', phone: '', email: '', company: '', address: '', city: '', state: '', pincode: '', gstin: '', isInterState: false }); setNotes(''); }
    } catch (error) { console.error('Error creating invoice:', error); }
    finally { setIsSubmitting(false); }
  };

  const handleSaveDraft = async () => { console.log('Saving draft...'); };
  const handleSyncOffline = async () => { console.log('Syncing offline bills...'); };

  return (
    <MainLayout title="Point of Sale - Deadpool Edition">
      <Box sx={{ minHeight: '100vh', backgroundColor: dpColors.bg, py: { xs: 2, sm: 3 } }}>
        <Container maxWidth="xl">
          <DpNetworkStatus isOnline={isOnline} offlineBillsCount={offlineBillsCount} onSyncClick={handleSyncOffline} subscription={subscription} usage={usage} />
          <DpSubscriptionStatus isLoading={false} isActive={subscription?.isActive} isOnline={isOnline} remainingInvoices={(subscription?.limits?.invoices || 0) - (usage?.invoices || 0)} />
          <DpHeaderSection isOnline={isOnline} grandTotal={grandTotal} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <DpBillItemsTable items={items} isInterState={isInterState} onAddProduct={() => setProductSearchOpen(true)} onUpdateItem={updateItem} onRemoveItem={removeItem} isOnline={isOnline} isSubscriptionActive={subscription?.isActive} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}><DpBusinessDetails business={business} /></Grid>
                <Grid item xs={12} md={6}><DpCustomerDetails customer={customer} businessState={business?.state} onCustomerChange={(field, value) => setCustomer(prev => ({ ...prev, [field]: value, isInterState: business?.state ? value !== business.state : false }))} onOpenSearch={() => setCustomerSearchOpen(true)} /></Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <DpInvoiceSummary
                invoiceNumber={invoiceNumber} invoiceDate={invoiceDate} paymentMethod={paymentMethod} notes={notes} isInterState={isInterState}
                subtotal={subtotal} totalDiscount={totalDiscount} totalTaxableAmount={totalTaxableAmount} totalCgst={totalCgst} totalSgst={totalSgst} totalIgst={totalIgst} grandTotal={grandTotal}
                isSubmitting={isSubmitting} itemsCount={items.length} customerName={customer.name} customerPhone={customer.phone} customerState={customer.state}
                isSubscriptionActive={subscription?.isActive} isOnline={isOnline}
                onInvoiceNumberChange={setInvoiceNumber} onInvoiceDateChange={setInvoiceDate} onPaymentMethodChange={setPaymentMethod} onNotesChange={setNotes}
                onSaveDraft={handleSaveDraft} onConfirmBill={handleConfirmBill}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <DpProductSearchDialog open={productSearchOpen} searchTerm={searchTerm} searchResults={searchResults} isInterState={isInterState} onClose={() => setProductSearchOpen(false)} onSearchChange={searchProducts} onSelectProduct={addProduct} />
      <DpCustomerSearchDialog open={customerSearchOpen} searchTerm={customerSearchTerm} searchResults={customerSearchResults} onClose={() => setCustomerSearchOpen(false)} onSearchChange={searchCustomers} onSelectCustomer={selectCustomer} />
    </MainLayout>
  );
}