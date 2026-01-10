// app/billing/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
  Badge,
  Divider,
  Backdrop,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  CloudOff as CloudOffIcon,
  CloudQueue as CloudQueueIcon,
  Sync as SyncIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useSubscription } from "@/hooks/useSubscription";
import { offlineStorage } from "@/utils/offlineStorage";
import { Product, Customer } from "@/types";
import { useRouter } from "next/navigation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  stockAvailable?: number;
}

interface BillCustomer {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state: string;
  pincode?: string;
  gstin?: string;
  isInterState: boolean;
}

interface Business {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber: string;
  phone: string;
  email: string;
  logo?: string;
}

interface OfflineBill {
  _id: string;
  localId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: BillCustomer;
  items: BillItem[];
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  notes: string;
  userId?: string;
  isLocal?: boolean;
  isSynced?: boolean;
  syncAttempts?: number;
  createdAt: string;
  updatedAt: string;
}

export default function BillingPage() {
  const router = useRouter();
  
  // Use hooks with proper dependencies
  const { products, isLoading: productsLoading, deductInventory, refetch: refetchProducts } = useProducts();
  const { customers, isLoading: customersLoading } = useCustomers();
  const { 
    subscription, 
    usage, 
    isLoading: subscriptionLoading, 
    canAddInvoice, 
    getRemaining,
    refetch: refetchSubscription 
  } = useSubscription();
  
  // State Management
  const [business, setBusiness] = useState<Business | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [customer, setCustomer] = useState<BillCustomer>({
    name: "",
    phone: "",
    state: "",
    isInterState: false,
  });
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date(),
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "upi" | "credit"
  >("cash");
  const [notes, setNotes] = useState("");
  
  // UI State
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [offlineBillsCount, setOfflineBillsCount] = useState(0);
  const [customerSearchDialog, setCustomerSearchDialog] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning' 
  });

  // Track initialization
  const [isInitialized, setIsInitialized] = useState(false);
  const [businessDataLoaded, setBusinessDataLoaded] = useState(false);

  // Initialize network status once
  useEffect(() => {
    if (isInitialized) return;
    
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    setIsInitialized(true);
  }, [isInitialized]);

  // Fetch business data only once
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (businessDataLoaded) return;
      
      try {
        // Fetch business details
        const businessResponse = await fetch("/api/business", {
          credentials: "include",
        });
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          setBusiness(businessData.business);
        }
        setBusinessDataLoaded(true);
      } catch (error) {
        console.error("Failed to initialize data:", error);
      }
    };

    fetchBusinessData();
  }, [businessDataLoaded]);

  // Load offline data - run once after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const loadOfflineData = async () => {
      try {
        // Load sync status
        const status = await offlineStorage.getSyncStatus();
        setSyncStatus(status);

        // Count offline bills
        const offlineBills = await offlineStorage.getItem<OfflineBill[]>("bills") || [];
        setOfflineBillsCount(offlineBills.filter(bill => bill.isLocal && !bill.isSynced).length);
      } catch (error) {
        console.error("Failed to load offline data:", error);
      }
    };

    loadOfflineData();
  }, [isInitialized]);

  // Network event listeners - run once
  useEffect(() => {
    if (!isInitialized) return;

    const handleOnline = () => {
      setIsOnline(true);
      showSnackbar("✅ Back online - ready to sync", "success");
    };

    const handleOffline = () => {
      setIsOnline(false);
      showSnackbar("📱 You are offline - bills saved locally", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isInitialized]);

  // Sync offline bills when coming online - with debounce
  const syncOfflineBills = useCallback(async () => {
    if (!isOnline) return;

    try {
      showSnackbar("🔄 Syncing offline bills...", "info");
      
      const offlineBills = await offlineStorage.getItem<OfflineBill[]>("bills") || [];
      const unsyncedBills = offlineBills.filter(bill => bill.isLocal && !bill.isSynced);
      
      if (unsyncedBills.length === 0) {
        showSnackbar("✅ All bills are synced", "success");
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const bill of unsyncedBills) {
        try {
          // Prepare bill data for API
          const apiBillData = {
            items: bill.items.map(item => ({
              productId: item.productId,
              variationId: item.variationId,
              name: item.name,
              variationName: item.variationName,
              price: item.price,
              quantity: item.quantity,
              discount: item.discount,
            })),
            customer: bill.customer,
            invoiceDetails: {
              invoiceNumber: bill.invoiceNumber,
              date: bill.invoiceDate,
            },
            paymentMethod: bill.paymentMethod,
            notes: bill.notes,
          };

          const response = await fetch("/api/billing", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(apiBillData),
          });

          if (response.ok) {
            // Mark bill as synced
            await offlineStorage.markItemAsSynced("bills", bill.localId || bill._id);
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error("❌ Error syncing bill:", error);
          errorCount++;
        }
      }

      // Update counts
      const updatedOfflineBills = await offlineStorage.getItem<OfflineBill[]>("bills") || [];
      setOfflineBillsCount(updatedOfflineBills.filter(bill => bill.isLocal && !bill.isSynced).length);
      
      // Refresh products to update stock
      refetchProducts();
      
      showSnackbar(
        `🔄 Sync complete: ${successCount} successful, ${errorCount} failed`,
        successCount > 0 ? "success" : "warning"
      );
    } catch (error) {
      console.error("❌ Sync failed:", error);
      showSnackbar("Failed to sync bills", "error");
    }
  }, [isOnline, refetchProducts]);

  // Auto-sync when coming online with debounce
  useEffect(() => {
    if (!isOnline) return;
    
    const timer = setTimeout(() => {
      syncOfflineBills();
    }, 2000); // Wait 2 seconds before auto-syncing
    
    return () => clearTimeout(timer);
  }, [isOnline, syncOfflineBills]);

  // Show snackbar helper
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Search products with variations
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];

    const results: any[] = [];

    products.forEach((product) => {
      // Search in product name, brand, category, SKU, HSN
      const searchLower = searchTerm.toLowerCase();
      const matches = 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.gstDetails.hsnCode.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower));

      if (matches && product.isActive !== false) {
        // Add base product
        const totalStock = 
          (product.variations?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0) +
          (product.batches?.reduce((sum: number, b: any) => sum + b.quantity, 0) || 0);

        results.push({
          _id: product._id,
          name: product.name,
          type: "product",
          displayName: `${product.name} (Base)`,
          price: product.basePrice,
          variationId: undefined,
          hsnCode: product.gstDetails.hsnCode,
          gstDetails: product.gstDetails,
          stock: totalStock,
          category: product.category,
          brand: product.brand,
          sku: product.sku,
        });

        // Add variations
        product.variations?.forEach((variation: any) => {
          const variationName = [
            variation.size,
            variation.color,
            variation.material,
          ]
            .filter(Boolean)
            .join(" ");

          const displayName = variationName 
            ? `${product.name} - ${variationName}`
            : `${product.name} (Default)`;

          results.push({
            _id: product._id,
            name: product.name,
            type: "variation",
            displayName,
            variationId: variation._id || variation.id,
            price: variation.price,
            costPrice: variation.costPrice,
            hsnCode: product.gstDetails.hsnCode,
            gstDetails: product.gstDetails,
            stock: variation.stock,
            size: variation.size,
            color: variation.color,
            material: variation.material,
            sku: variation.sku,
            category: product.category,
            brand: product.brand,
          });
        });
      }
    });

    return results.slice(0, 15);
  }, [searchTerm, products]);

  // Search customers
  const customerSearchResults = useMemo(() => {
    if (!customerSearchTerm) return [];

    return customers
      .filter(customer => 
        customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.phone.includes(customerSearchTerm) ||
        customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
      .slice(0, 10);
  }, [customerSearchTerm, customers]);

  // Calculate GST helper
  const calculateGST = useCallback((item: any, isInterState: boolean, gstDetails: any) => {
    const itemTotal = item.price * item.quantity;
    const discountAmount = (itemTotal * (item.discount || 0)) / 100;
    const taxableAmount = itemTotal - discountAmount;

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstAmount = (taxableAmount * (gstDetails.igstRate || 0)) / 100;
    } else {
      cgstAmount = (taxableAmount * (gstDetails.cgstRate || 0)) / 100;
      sgstAmount = (taxableAmount * (gstDetails.sgstRate || 0)) / 100;
    }

    return { taxableAmount, cgstAmount, sgstAmount, igstAmount };
  }, []);

  // Calculate total helper
  const calculateTotal = useCallback((item: any, isInterState: boolean, gstDetails: any) => {
    const { taxableAmount, cgstAmount, sgstAmount, igstAmount } = calculateGST(item, isInterState, gstDetails);
    return taxableAmount + cgstAmount + sgstAmount + igstAmount;
  }, [calculateGST]);

  // Add product to bill
  const addToBill = useCallback((product: any) => {
    // Check if already in bill
    const existingItem = billItems.find(
      (item) =>
        item.productId === product._id &&
        item.variationId === product.variationId
    );

    if (existingItem) {
      // Check stock before increasing quantity
      if (existingItem.quantity + 1 > (product.stock || 0)) {
        showSnackbar(`Only ${product.stock} items available in stock`, "warning");
        return;
      }

      // Increase quantity and recalculate
      setBillItems(prev =>
        prev.map(item =>
          item.productId === product._id &&
          item.variationId === product.variationId
            ? {
                ...item,
                quantity: item.quantity + 1,
                taxableAmount: (item.price * (item.quantity + 1)) * (1 - item.discount / 100),
                cgstAmount: calculateGST(item, customer.isInterState, product.gstDetails).cgstAmount * (item.quantity + 1),
                sgstAmount: calculateGST(item, customer.isInterState, product.gstDetails).sgstAmount * (item.quantity + 1),
                igstAmount: calculateGST(item, customer.isInterState, product.gstDetails).igstAmount * (item.quantity + 1),
                total: calculateTotal(item, customer.isInterState, product.gstDetails) * (item.quantity + 1),
              }
            : item
        )
      );
    } else {
      // Check stock for new item
      if (product.stock < 1) {
        showSnackbar("Product out of stock", "warning");
        return;
      }

      // Create new bill item
      const newItem: BillItem = {
        productId: product._id,
        variationId: product.variationId,
        name: product.name,
        variationName: product.variationId ? product.displayName.split("-").pop()?.trim() : undefined,
        hsnCode: product.hsnCode,
        price: product.price,
        quantity: 1,
        discount: 0,
        taxableAmount: product.price,
        ...calculateGST({ price: product.price, discount: 0, quantity: 1 }, customer.isInterState, product.gstDetails),
        total: calculateTotal({ price: product.price, discount: 0, quantity: 1 }, customer.isInterState, product.gstDetails),
        stockAvailable: product.stock,
      };

      setBillItems(prev => [...prev, newItem]);
    }

    setSearchTerm("");
    setSearchDialogOpen(false);
  }, [billItems, customer.isInterState, calculateGST, calculateTotal, showSnackbar]);

  // Get available stock for a product
  const getStockAvailable = useCallback((productId: string, variationId?: string) => {
    const product = products.find(p => p._id === productId);
    if (!product) return 0;

    if (variationId) {
      const variation = product.variations?.find((v: any) => v._id === variationId);
      return variation?.stock || 0;
    } else {
      const variationsStock = product.variations?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
      const batchesStock = product.batches?.reduce((sum: number, b: any) => sum + b.quantity, 0) || 0;
      return variationsStock + batchesStock;
    }
  }, [products]);

  // Update item in bill
  const updateItem = useCallback((index: number, field: keyof BillItem, value: any) => {
    setBillItems(prev => {
      const updated = [...prev];
      const item = updated[index];

      // Find product for GST rates
      const product = products.find(p => p._id === item.productId);
      if (!product) return prev;

      // Check stock for quantity changes
      if (field === "quantity") {
        const stockAvailable = getStockAvailable(item.productId, item.variationId);
        if (value > stockAvailable) {
          showSnackbar(`Only ${stockAvailable} items available`, "warning");
          return prev;
        }
      }

      // Create updated item
      const updatedItem = { ...item, [field]: value };

      // Recalculate amounts
      const { taxableAmount, cgstAmount, sgstAmount, igstAmount } = calculateGST(
        updatedItem,
        customer.isInterState,
        product.gstDetails
      );

      const total = taxableAmount + cgstAmount + sgstAmount + igstAmount;

      updated[index] = {
        ...updatedItem,
        taxableAmount,
        cgstAmount,
        sgstAmount,
        igstAmount,
        total,
      };

      return updated;
    });
  }, [customer.isInterState, getStockAvailable, calculateGST, showSnackbar, products]);

  // Remove item from bill
  const removeItem = useCallback((index: number) => {
    setBillItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle customer changes
  const handleCustomerChange = useCallback((field: keyof BillCustomer, value: any) => {
    setCustomer(prev => {
      const updatedCustomer = { ...prev, [field]: value };

      // Auto-detect interstate based on business state
      if (field === "state" && business) {
        updatedCustomer.isInterState = value !== business.state;
      }

      // Recalculate GST for all items if interstate status changes
      if (field === "state") {
        setBillItems(prevItems =>
          prevItems.map(item => {
            const product = products.find(p => p._id === item.productId);
            if (!product) return item;

            const { taxableAmount, cgstAmount, sgstAmount, igstAmount } = calculateGST(
              item,
              updatedCustomer.isInterState,
              product.gstDetails
            );

            const total = taxableAmount + cgstAmount + sgstAmount + igstAmount;

            return {
              ...item,
              taxableAmount,
              cgstAmount,
              sgstAmount,
              igstAmount,
              total,
            };
          })
        );
      }

      return updatedCustomer;
    });
  }, [business, products, calculateGST]);

  // Select customer from search
  const selectCustomer = useCallback((selectedCustomer: Customer) => {
    setCustomer({
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email || "",
      company: selectedCustomer.company || "",
      address: selectedCustomer.address || "",
      city: selectedCustomer.city || "",
      state: selectedCustomer.state || business?.state || "",
      pincode: selectedCustomer.pincode || "",
      gstin: selectedCustomer.gstin || "",
      isInterState: selectedCustomer.state !== business?.state,
    });
    setCustomerSearchDialog(false);
    setCustomerSearchTerm("");
  }, [business]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = billItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const totalDiscount = billItems.reduce(
      (sum, item) => sum + ((item.price * item.quantity * item.discount) / 100),
      0
    );
    const totalTaxableAmount = billItems.reduce(
      (sum, item) => sum + item.taxableAmount,
      0
    );
    const totalCgst = billItems.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSgst = billItems.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIgst = billItems.reduce((sum, item) => sum + item.igstAmount, 0);
    const grandTotal = totalTaxableAmount + totalCgst + totalSgst + totalIgst;

    return {
      subtotal,
      totalDiscount,
      totalTaxableAmount,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal,
    };
  }, [billItems]);

  // Prepare items for API
  const apiItems = useMemo(() => {
    return billItems.map(item => ({
      productId: item.productId,
      variationId: item.variationId,
      name: item.name,
      variationName: item.variationName,
      price: item.price,
      quantity: item.quantity,
      discount: item.discount,
    }));
  }, [billItems]);

  // Update local inventory for offline mode
  const updateLocalInventory = useCallback(async (items: BillItem[]) => {
    const localProducts = await offlineStorage.getItem<Product[]>("products") || [];
    const updatedProducts = [...localProducts];

    for (const item of items) {
      const productIndex = updatedProducts.findIndex(p => p._id === item.productId);
      if (productIndex === -1) continue;

      const product = updatedProducts[productIndex];

      if (item.variationId) {
        // Deduct from variation
        const variationIndex = product.variations?.findIndex((v: any) => v._id === item.variationId);
        if (variationIndex !== undefined && variationIndex !== -1 && product.variations) {
          if (product.variations[variationIndex].stock >= item.quantity) {
            product.variations[variationIndex].stock -= item.quantity;
          }
        }
      } else {
        // Deduct from first variation or batches
        if (product.variations && product.variations.length > 0) {
          if (product.variations[0].stock >= item.quantity) {
            product.variations[0].stock -= item.quantity;
          }
        }
      }

      updatedProducts[productIndex] = product;
    }

    await offlineStorage.setItem("products", updatedProducts);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setBillItems([]);
    setCustomer({
      name: "",
      phone: "",
      state: "",
      isInterState: false,
    });
    setInvoiceDetails({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date(),
    });
    setPaymentMethod("cash");
    setNotes("");
    setSearchTerm("");
  }, []);

  // Confirm and create bill
  const confirmBill = useCallback(async () => {
    setError(null);

    // Validate customer
    if (!customer.name || !customer.phone) {
      setError("Please enter customer name and phone number");
      return;
    }

    if (!customer.state) {
      setError("Please enter customer state");
      return;
    }

    // Validate items
    if (billItems.length === 0) {
      setError("Please add at least one item to the bill");
      return;
    }

    // Check stock availability
    for (const item of billItems) {
      const availableStock = getStockAvailable(item.productId, item.variationId);
      if (availableStock < item.quantity) {
        setError(`Insufficient stock for ${item.name}. Available: ${availableStock}`);
        return;
      }
    }

    // Check subscription for online mode
    if (isOnline && (!subscription?.isActive || !canAddInvoice)) {
      const remaining = getRemaining("invoices");
      setError(
        subscription?.isActive 
          ? `You've reached your invoice limit! Remaining: ${remaining}. Please upgrade your plan.`
          : "Your subscription is not active. Please renew to create bills."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const billData = {
        items: apiItems,
        customer: {
          ...customer,
          company: customer.company || "",
          address: customer.address || "",
          city: customer.city || "",
          pincode: customer.pincode || "",
          email: customer.email || "",
        },
        invoiceDetails: {
          invoiceNumber: invoiceDetails.invoiceNumber,
          date: invoiceDetails.date.toISOString(),
        },
        paymentMethod,
        notes,
        createdAt: new Date().toISOString(),
        status: isOnline ? "pending" : "offline",
      };

      if (isOnline) {
        // Online mode - send to server
        const response = await fetch("/api/billing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(billData),
        });

        const result = await response.json();

        if (response.ok) {
          // Deduct inventory
          const itemsForDeduction = billItems.map(item => ({
            productId: item.productId,
            variationId: item.variationId,
            quantity: item.quantity,
          }));

          try {
            await deductInventory(itemsForDeduction);
            console.log("✅ Inventory deducted successfully");
          } catch (inventoryError) {
            console.error("❌ Failed to deduct inventory:", inventoryError);
            showSnackbar(
              "Bill created but inventory update failed. Please update inventory manually.",
              "warning"
            );
          }

          // Save to offline storage as backup
          await offlineStorage.addItem("bills", {
            ...result.order,
            originalBillData: billData,
            synced: true,
          });

          showSnackbar("✅ Bill created successfully!", "success");

          // Reset form
          resetForm();

          // Redirect to print page after delay
          setTimeout(() => {
            if (result.order?.id) {
              router.push(`/billing/print/${result.order.id}`);
            }
          }, 1500);
        } else {
          setError(result.message || "Failed to create bill");
          showSnackbar("Failed to create bill", "error");
        }
      } else {
        // Offline mode - save locally
        const localBillId = `local_bill_${Date.now()}`;
        const offlineBill: OfflineBill = {
          _id: localBillId,
          invoiceNumber: invoiceDetails.invoiceNumber,
          invoiceDate: invoiceDetails.date.toISOString(),
          customer: billData.customer,
          items: billItems.map(item => ({
            ...item,
            stockAvailable: getStockAvailable(item.productId, item.variationId),
          })),
          subtotal: totals.subtotal,
          totalDiscount: totals.totalDiscount,
          totalTaxableAmount: totals.totalTaxableAmount,
          totalCgst: totals.totalCgst,
          totalSgst: totals.totalSgst,
          totalIgst: totals.totalIgst,
          grandTotal: totals.grandTotal,
          paymentMethod,
          paymentStatus: "pending",
          status: "draft",
          notes,
          isLocal: true,
          isSynced: false,
          syncAttempts: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save bill to offline storage
        const saveResult = await offlineStorage.addItem("bills", offlineBill);
        
        if (!saveResult.success) {
          throw new Error("Failed to save bill locally");
        }

        // Update local inventory
        await updateLocalInventory(billItems);

        // Update offline bills count
        const offlineBills = await offlineStorage.getItem<OfflineBill[]>("bills") || [];
        setOfflineBillsCount(offlineBills.filter(bill => bill.isLocal && !bill.isSynced).length);

        showSnackbar("📱 Bill saved locally - will sync when online", "info");

        // Reset form
        resetForm();
      }
    } catch (error: any) {
      console.error("❌ Error creating bill:", error);
      setError(error.message || "Failed to create bill");
      showSnackbar("Failed to create bill", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    customer, 
    billItems, 
    getStockAvailable, 
    isOnline, 
    subscription, 
    canAddInvoice, 
    getRemaining,
    apiItems, 
    invoiceDetails, 
    paymentMethod, 
    notes, 
    deductInventory, 
    resetForm, 
    router, 
    totals, 
    updateLocalInventory, 
    showSnackbar
  ]);

  // Subscription status display
  const renderSubscriptionStatus = () => {
    if (subscriptionLoading) {
      return <CircularProgress size={20} />;
    }

    if (!subscription?.isActive && isOnline) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          Your subscription is not active. Please renew to create bills.
        </Alert>
      );
    }

    const remainingInvoices = getRemaining("invoices");
    if (remainingInvoices <= 5 && isOnline) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have {remainingInvoices} invoices remaining. Consider upgrading your plan.
        </Alert>
      );
    }

    return null;
  };

  // Loading state
  if (productsLoading || customersLoading) {
    return (
      <MainLayout title="Point of Sale">
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MainLayout title="Point of Sale - Billing">
        <Box sx={{ p: 3, maxWidth: "1400px", margin: "0 auto" }}>
          {/* Online/Offline Status */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isOnline ? (
                  <>
                    <CloudQueueIcon color="success" />
                    <Typography variant="body2" color="success.main">
                      Online - Real-time billing
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudOffIcon color="warning" />
                    <Typography variant="body2" color="warning.main">
                      Offline - Bills saved locally
                    </Typography>
                  </>
                )}
                
                {offlineBillsCount > 0 && (
                  <Tooltip title={`${offlineBillsCount} bills waiting to sync`}>
                    <Badge badgeContent={offlineBillsCount} color="warning">
                      <IconButton 
                        size="small" 
                        onClick={syncOfflineBills}
                        disabled={!isOnline}
                      >
                        <SyncIcon />
                      </IconButton>
                    </Badge>
                  </Tooltip>
                )}
              </Box>
              
              {subscription && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={subscription.plan.toUpperCase()} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {usage?.invoices || 0} / {subscription.limits?.invoices || 0} invoices
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Subscription Status */}
          {renderSubscriptionStatus()}

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Header */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  🧾 Point of Sale
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {isOnline
                    ? "Create professional invoices with GST calculations"
                    : "Offline Mode - Bills saved locally"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="h5" fontWeight="bold">
                  Grand Total
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₹{totals.grandTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Main Content - Using flexbox instead of Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            '& > *': {
              flex: '1 1 calc(66.666% - 12px)',
              minWidth: 300
            }
          }}>
            {/* Left Column - Customer & Products */}
            <Box>
              {/* Customer & Business Details */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                mb: 3,
                '& > *': {
                  flex: '1 1 calc(50% - 8px)',
                  minWidth: 250
                }
              }}>
                {/* Business Details */}
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <ReceiptIcon sx={{ mr: 1 }} />
                      Seller Details
                    </Typography>
                    {business ? (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {business.businessName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          GST: {business.gstNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {business.address}, {business.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {business.state}, {business.pincode}
                        </Typography>
                      </Box>
                    ) : (
                      <Alert severity="info">
                        Please set up your business profile in settings.
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Customer Details */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Customer Details
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setCustomerSearchDialog(true)}
                      >
                        Search Customer
                      </Button>
                    </Box>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Customer Name *"
                        value={customer.name}
                        onChange={(e) =>
                          handleCustomerChange("name", e.target.value)
                        }
                        size="small"
                      />
                      <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Phone *"
                          value={customer.phone}
                          onChange={(e) =>
                            handleCustomerChange("phone", e.target.value)
                          }
                          size="small"
                        />
                        <TextField
                          fullWidth
                          label="GSTIN"
                          value={customer.gstin}
                          onChange={(e) =>
                            handleCustomerChange("gstin", e.target.value)
                          }
                          size="small"
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="State *"
                        value={customer.state}
                        onChange={(e) =>
                          handleCustomerChange("state", e.target.value)
                        }
                        size="small"
                        placeholder="Enter customer state"
                        required
                      />
                      <Box>
                        <Chip
                          label={
                            customer.isInterState
                              ? "Inter-State Transaction (IGST)"
                              : "Intra-State Transaction (CGST+SGST)"
                          }
                          color={
                            customer.isInterState ? "secondary" : "primary"
                          }
                          variant="outlined"
                        />
                        {business && (
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 0.5, color: "text.secondary" }}
                          >
                            Your business is in {business.state}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              {/* Product Search & Bill Items */}
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
                      Bill Items ({billItems.length})
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => setSearchDialogOpen(true)}
                      variant="contained"
                      disabled={!isOnline && !subscription?.isActive}
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
                        {billItems.map((item, index) => (
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
                                  updateItem(
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
                                  updateItem(
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
                                  updateItem(
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
                              {customer.isInterState ? (
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
                                onClick={() => removeItem(index)}
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

                  {billItems.length === 0 && (
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
            </Box>

            {/* Right Column - Summary & Actions */}
            <Box sx={{ flex: '1 1 calc(33.333% - 12px)', minWidth: 300 }}>
              <Card sx={{ position: "sticky", top: 100 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Invoice Details
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Invoice Number"
                      value={invoiceDetails.invoiceNumber}
                      onChange={(e) =>
                        setInvoiceDetails(prev => ({
                          ...prev,
                          invoiceNumber: e.target.value,
                        }))
                      }
                      size="small"
                    />
                    
                    <DatePicker
                      label="Invoice Date"
                      value={invoiceDetails.date}
                      onChange={(newDate) => 
                        setInvoiceDetails(prev => ({ ...prev, date: newDate || new Date() }))
                      }
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                    
                    <FormControl fullWidth size="small">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as any)
                        }
                      >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="card">Card</MenuItem>
                        <MenuItem value="upi">UPI</MenuItem>
                        <MenuItem value="credit">Credit</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>

                  {/* Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Summary
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Subtotal:</Typography>
                        <Typography>
                          ₹{totals.subtotal.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Discount:</Typography>
                        <Typography color="error">
                          -₹{totals.totalDiscount.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Taxable Amount:</Typography>
                        <Typography>
                          ₹{totals.totalTaxableAmount.toLocaleString()}
                        </Typography>
                      </Box>
                      {!customer.isInterState ? (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>CGST:</Typography>
                            <Typography>
                              ₹{totals.totalCgst.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>SGST:</Typography>
                            <Typography>
                              ₹{totals.totalSgst.toLocaleString()}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>IGST:</Typography>
                          <Typography>
                            ₹{totals.totalIgst.toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          pt: 1,
                        }}
                      >
                        <Typography variant="h6">Grand Total:</Typography>
                        <Typography variant="h6" color="primary">
                          ₹{totals.grandTotal.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Notes */}
                  <TextField
                    fullWidth
                    label="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={3}
                    size="small"
                    sx={{ mb: 3 }}
                  />

                  {/* Action Buttons */}
                  <Stack spacing={1}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<SaveIcon />}
                      disabled={!subscription?.isActive}
                    >
                      Save Draft
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PrintIcon />}
                      onClick={confirmBill}
                      disabled={
                        isSubmitting ||
                        billItems.length === 0 ||
                        !customer.name ||
                        !customer.phone ||
                        !customer.state ||
                        (!subscription?.isActive && isOnline)
                      }
                      size="large"
                    >
                      {isSubmitting ? 'Creating...' : 'Confirm & Print'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Product Search Dialog */}
          <Dialog
            open={searchDialogOpen}
            onClose={() => setSearchDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Search Products</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                placeholder="Search products by name, SKU, category, brand, or HSN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ mb: 2 }}
                autoFocus
              />
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {searchResults.map((product, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: 1,
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => addToBill(product)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {product.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          HSN: {product.hsnCode} • Stock: {product.stock} • Category: {product.category}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={customer.isInterState ? "IGST" : "CGST+SGST"}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`₹${product.price.toLocaleString()}`}
                            size="small"
                            color="primary"
                          />
                          {product.stock < 10 && (
                            <Chip
                              label="Low Stock"
                              size="small"
                              color="warning"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" display="block">
                          {product.type === "variation" ? "Variation" : "Product"}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
                {searchResults.length === 0 && searchTerm && (
                  <Typography
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 3 }}
                  >
                    No products found for "{searchTerm}"
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSearchDialogOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>

          {/* Customer Search Dialog */}
          <Dialog
            open={customerSearchDialog}
            onClose={() => setCustomerSearchDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Search Customer</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                placeholder="Search by name, phone, or email..."
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ mb: 2 }}
                autoFocus
              />
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {customerSearchResults.map((cust, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: 1,
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => selectCustomer(cust)}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {cust.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📞 {cust.phone} {cust.email && `• ✉️ ${cust.email}`}
                      </Typography>
                      {cust.company && (
                        <Typography variant="body2" color="text.secondary">
                          🏢 {cust.company}
                        </Typography>
                      )}
                      {cust.address && (
                        <Typography variant="caption" color="text.secondary">
                          📍 {cust.address}, {cust.city}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                ))}
                {customerSearchResults.length === 0 && customerSearchTerm && (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                    No customers found
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCustomerSearchDialog(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setSnackbar({ ...snackbar, open: false })} 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Backdrop for loading */}
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isSubmitting}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {isOnline ? 'Creating Bill...' : 'Saving Bill Locally...'}
              </Typography>
            </Box>
          </Backdrop>
        </Box>
      </MainLayout>
    </LocalizationProvider>
  );
}