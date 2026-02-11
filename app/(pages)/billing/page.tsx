'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
  Backdrop,
  Stack,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomers";
import { useSubscription } from "@/hooks/useSubscription";
import { offlineStorage } from "@/utils/offlineStorage";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Import components
import { NetworkStatus } from "@/components/billing/NetworkStatus";
import { HeaderSection } from "@/components/billing/HeaderSection";
import { BusinessDetails } from "@/components/billing/BusinessDetails";
import { CustomerDetails } from "@/components/billing/CustomerDetails";
import { BillItemsTable } from "@/components/billing/BillItemsTable";
import { InvoiceSummary } from "@/components/billing/InvoiceSummary";
import { ProductSearchDialog } from "@/components/billing/ProductSearchDialog";
import { CustomerSearchDialog } from "@/components/billing/CustomerSearchDialog";
import { SubscriptionStatus } from "@/components/billing/SubscriptionStatus";

// Import types
import {
  BillItem,
  BillCustomer,
  Business,
  Product,
  OfflineBill,
  Customer,
  SearchProductOptional,
  ProductGstDetails,
} from "@/types/billing";
import { Subscription, Usage } from "@/types/billing";

export default function BillingPage() {
  const router = useRouter();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use hooks with proper dependencies
  const {
    products,
    isLoading: productsLoading,
    deductInventory,
    refetch: refetchProducts,
  } = useProducts();
  const { customers, isLoading: customersLoading } = useCustomers();
  const {
    subscription,
    usage,
    isLoading: subscriptionLoading,
    canAddInvoice,
    getRemaining,
    refetch: refetchSubscription,
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
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Track initialization
  const [isInitialized, setIsInitialized] = useState(false);
  const [businessDataLoaded, setBusinessDataLoaded] = useState(false);

  // Initialize network status once
  useEffect(() => {
    if (isInitialized) return;

    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
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
        const offlineBills =
          (await offlineStorage.getItem<OfflineBill[]>("bills")) || [];
        setOfflineBillsCount(
          offlineBills.filter((bill) => bill.isLocal && !bill.isSynced).length,
        );
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

      const offlineBills =
        (await offlineStorage.getItem<OfflineBill[]>("bills")) || [];
      const unsyncedBills = offlineBills.filter(
        (bill) => bill.isLocal && !bill.isSynced,
      );

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
            items: bill.items.map((item) => ({
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
            await offlineStorage.markItemAsSynced(
              "bills",
              bill.localId || bill._id,
            );
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
      const updatedOfflineBills =
        (await offlineStorage.getItem<OfflineBill[]>("bills")) || [];
      setOfflineBillsCount(
        updatedOfflineBills.filter((bill) => bill.isLocal && !bill.isSynced)
          .length,
      );

      // Refresh products to update stock
      refetchProducts();

      showSnackbar(
        `🔄 Sync complete: ${successCount} successful, ${errorCount} failed`,
        successCount > 0 ? "success" : "warning",
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
  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  // Search products with variations
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];

    const results: SearchProductOptional[] = [];

    products.forEach((product) => {
      // Search in product name, brand, category, SKU, HSN
      const searchLower = searchTerm.toLowerCase();
      const matches =
        product.name.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.gstDetails.hsnCode.toLowerCase().includes(searchLower) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      if (matches && product.isActive !== false) {
        // Add base product
        const totalStock =
          (product.variations?.reduce(
            (sum: number, v: any) => sum + v.stock,
            0,
          ) || 0) +
          (product.batches?.reduce(
            (sum: number, b: any) => sum + b.quantity,
            0,
          ) || 0);

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
      .filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(customerSearchTerm.toLowerCase()) ||
          customer.phone.includes(customerSearchTerm) ||
          customer.email
            ?.toLowerCase()
            .includes(customerSearchTerm.toLowerCase()),
      )
      .slice(0, 10);
  }, [customerSearchTerm, customers]);

  // Calculate GST helper
  const calculateGST = useCallback(
    (item: any, isInterState: boolean, gstDetails: ProductGstDetails) => {
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
    },
    [],
  );

  // Calculate total helper
  const calculateTotal = useCallback(
    (item: any, isInterState: boolean, gstDetails: ProductGstDetails) => {
      const { taxableAmount, cgstAmount, sgstAmount, igstAmount } =
        calculateGST(item, isInterState, gstDetails);
      return taxableAmount + cgstAmount + sgstAmount + igstAmount;
    },
    [calculateGST],
  );

  // Add product to bill
  const addToBill = useCallback(
    (product: SearchProductOptional) => {
      // Check if already in bill
      const existingItem = billItems.find(
        (item) =>
          item.productId === product._id &&
          item.variationId === product.variationId,
      );

      if (existingItem) {
        // Check stock before increasing quantity
        if (existingItem.quantity + 1 > (product.stock || 0)) {
          showSnackbar(
            `Only ${product.stock} items available in stock`,
            "warning",
          );
          return;
        }

        // Increase quantity and recalculate
        setBillItems((prev) =>
          prev.map((item) =>
            item.productId === product._id &&
            item.variationId === product.variationId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  taxableAmount:
                    item.price *
                    (item.quantity + 1) *
                    (1 - item.discount / 100),
                  cgstAmount:
                    calculateGST(
                      item,
                      customer.isInterState,
                      product.gstDetails,
                    ).cgstAmount *
                    (item.quantity + 1),
                  sgstAmount:
                    calculateGST(
                      item,
                      customer.isInterState,
                      product.gstDetails,
                    ).sgstAmount *
                    (item.quantity + 1),
                  igstAmount:
                    calculateGST(
                      item,
                      customer.isInterState,
                      product.gstDetails,
                    ).igstAmount *
                    (item.quantity + 1),
                  total:
                    calculateTotal(
                      item,
                      customer.isInterState,
                      product.gstDetails,
                    ) *
                    (item.quantity + 1),
                }
              : item,
          ),
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
          variationName: product.variationId
            ? product.displayName.split("-").pop()?.trim()
            : undefined,
          hsnCode: product.hsnCode,
          price: product.price,
          quantity: 1,
          discount: 0,
          // taxableAmount is included in calculateGST spread
          ...calculateGST(
            { price: product.price, discount: 0, quantity: 1 },
            customer.isInterState,
            product.gstDetails,
          ),
          total: calculateTotal(
            { price: product.price, discount: 0, quantity: 1 },
            customer.isInterState,
            product.gstDetails,
          ),
          stockAvailable: product.stock,
        };

        setBillItems((prev) => [...prev, newItem]);
      }

      setSearchTerm("");
      setSearchDialogOpen(false);
    },
    [
      billItems,
      customer.isInterState,
      calculateGST,
      calculateTotal,
      showSnackbar,
    ],
  );

  // Get available stock for a product
  const getStockAvailable = useCallback(
    (productId: string, variationId?: string) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return 0;

      if (variationId) {
        const variation = product.variations?.find(
          (v: any) => v._id === variationId,
        );
        return variation?.stock || 0;
      } else {
        const variationsStock =
          product.variations?.reduce(
            (sum: number, v: any) => sum + v.stock,
            0,
          ) || 0;
        const batchesStock =
          product.batches?.reduce(
            (sum: number, b: any) => sum + b.quantity,
            0,
          ) || 0;
        return variationsStock + batchesStock;
      }
    },
    [products],
  );

  // Update item in bill
  const updateItem = useCallback(
    (index: number, field: keyof BillItem, value: any) => {
      setBillItems((prev) => {
        const updated = [...prev];
        const item = updated[index];

        // Find product for GST rates
        const product = products.find((p) => p._id === item.productId);
        if (!product) return prev;

        // Check stock for quantity changes
        if (field === "quantity") {
          const stockAvailable = getStockAvailable(
            item.productId,
            item.variationId,
          );
          if (value > stockAvailable) {
            showSnackbar(`Only ${stockAvailable} items available`, "warning");
            return prev;
          }
        }

        // Create updated item
        const updatedItem = { ...item, [field]: value };

        // Recalculate amounts
        const { taxableAmount, cgstAmount, sgstAmount, igstAmount } =
          calculateGST(updatedItem, customer.isInterState, product.gstDetails);

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
    },
    [
      customer.isInterState,
      getStockAvailable,
      calculateGST,
      showSnackbar,
      products,
    ],
  );

  // Remove item from bill
  const removeItem = useCallback((index: number) => {
    setBillItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle customer changes
  const handleCustomerChange = useCallback(
    (field: keyof BillCustomer, value: any) => {
      setCustomer((prev) => {
        const updatedCustomer = { ...prev, [field]: value };

        // Auto-detect interstate based on business state
        if (field === "state" && business) {
          updatedCustomer.isInterState = value !== business.state;
        }

        // Recalculate GST for all items if interstate status changes
        if (field === "state") {
          setBillItems((prevItems) =>
            prevItems.map((item) => {
              const product = products.find((p) => p._id === item.productId);
              if (!product) return item;

              const { taxableAmount, cgstAmount, sgstAmount, igstAmount } =
                calculateGST(
                  item,
                  updatedCustomer.isInterState,
                  product.gstDetails,
                );

              const total =
                taxableAmount + cgstAmount + sgstAmount + igstAmount;

              return {
                ...item,
                taxableAmount,
                cgstAmount,
                sgstAmount,
                igstAmount,
                total,
              };
            }),
          );
        }

        return updatedCustomer;
      });
    },
    [business, products, calculateGST],
  );

  // Select customer from search
  const selectCustomer = useCallback(
    (selectedCustomer: Customer) => {
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
    },
    [business],
  );

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = billItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalDiscount = billItems.reduce(
      (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
      0,
    );
    const totalTaxableAmount = billItems.reduce(
      (sum, item) => sum + item.taxableAmount,
      0,
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
    return billItems.map((item) => ({
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
    const localProducts =
      (await offlineStorage.getItem<Product[]>("products")) || [];
    const updatedProducts = [...localProducts];

    for (const item of items) {
      const productIndex = updatedProducts.findIndex(
        (p) => p._id === item.productId,
      );
      if (productIndex === -1) continue;

      const product = updatedProducts[productIndex];

      if (item.variationId) {
        // Deduct from variation
        const variationIndex = product.variations?.findIndex(
          (v: any) => v._id === item.variationId,
        );
        if (
          variationIndex !== undefined &&
          variationIndex !== -1 &&
          product.variations
        ) {
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
      const availableStock = getStockAvailable(
        item.productId,
        item.variationId,
      );
      if (availableStock < item.quantity) {
        setError(
          `Insufficient stock for ${item.name}. Available: ${availableStock}`,
        );
        return;
      }
    }

    // Check subscription for online mode
    if (isOnline && (!subscription?.isActive || !canAddInvoice)) {
      const remaining = getRemaining("invoices");
      setError(
        subscription?.isActive
          ? `You've reached your invoice limit! Remaining: ${remaining}. Please upgrade your plan.`
          : "Your subscription is not active. Please renew to create bills.",
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
          const itemsForDeduction = billItems.map((item) => ({
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
              "warning",
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
          items: billItems.map((item) => ({
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
        const offlineBills =
          (await offlineStorage.getItem<OfflineBill[]>("bills")) || [];
        setOfflineBillsCount(
          offlineBills.filter((bill) => bill.isLocal && !bill.isSynced).length,
        );

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
    showSnackbar,
  ]);

  // Loading state
  if (productsLoading || customersLoading) {
    return (
      <MainLayout title="Point of Sale">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 3,
              minHeight: 400,
            }}
          >
            <CircularProgress size={48} sx={{ color: darkMode ? '#8ab4f8' : '#1a73e8' }} />
            <Typography variant="h6" sx={{ color: darkMode ? '#e8eaed' : '#202124' }}>
              Loading billing system...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MainLayout title="Point of Sale - Billing">
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Online/Offline Status - Google Material Design Style */}
          <NetworkStatus
            isOnline={isOnline}
            offlineBillsCount={offlineBillsCount}
            onSyncClick={syncOfflineBills}
            subscription={subscription || undefined}
            usage={usage || undefined}
          />

          {/* Subscription Status - Google Material Design Style */}
          <SubscriptionStatus
            isLoading={subscriptionLoading}
            isActive={subscription?.isActive || false}
            isOnline={isOnline}
            remainingInvoices={getRemaining("invoices")}
          />

          {/* Error Display - Google Material Design Style */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'}`,
                color: darkMode ? '#f28b82' : '#c5221f',
                '& .MuiAlert-icon': {
                  color: darkMode ? '#f28b82' : '#c5221f',
                },
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Header - Google Material Design Style */}
          <HeaderSection isOnline={isOnline} grandTotal={totals.grandTotal} />

          {/* Main Content - Using flexbox instead of Grid */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              "& > *": {
                flex: "1 1 calc(66.666% - 12px)",
                minWidth: 300,
              },
            }}
          >
            {/* Left Column - Customer & Products */}
            <Box>
              {/* Customer & Business Details - Google Material Design Style */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                  "& > *": {
                    flex: "1 1 calc(50% - 8px)",
                    minWidth: 250,
                  },
                }}
              >
                {/* Business Details */}
                <BusinessDetails business={business} />

                {/* Customer Details */}
                <CustomerDetails
                  customer={customer}
                  businessState={business?.state}
                  onCustomerChange={handleCustomerChange}
                  onOpenSearch={() => setCustomerSearchDialog(true)}
                />
              </Box>

              {/* Product Search & Bill Items - Google Material Design Style */}
              <BillItemsTable
                items={billItems}
                isInterState={customer.isInterState}
                onAddProduct={() => setSearchDialogOpen(true)}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                isOnline={isOnline}
                isSubscriptionActive={subscription?.isActive}
              />
            </Box>

            {/* Right Column - Summary & Actions - Google Material Design Style */}
            <Box sx={{ flex: "1 1 calc(33.333% - 12px)", minWidth: 300 }}>
              <InvoiceSummary
                invoiceNumber={invoiceDetails.invoiceNumber}
                invoiceDate={invoiceDetails.date}
                paymentMethod={paymentMethod}
                notes={notes}
                isInterState={customer.isInterState}
                subtotal={totals.subtotal}
                totalDiscount={totals.totalDiscount}
                totalTaxableAmount={totals.totalTaxableAmount}
                totalCgst={totals.totalCgst}
                totalSgst={totals.totalSgst}
                totalIgst={totals.totalIgst}
                grandTotal={totals.grandTotal}
                isSubmitting={isSubmitting}
                itemsCount={billItems.length}
                customerName={customer.name}
                customerPhone={customer.phone}
                customerState={customer.state}
                isSubscriptionActive={subscription?.isActive || false}
                isOnline={isOnline}
                onInvoiceNumberChange={(value) =>
                  setInvoiceDetails((prev) => ({
                    ...prev,
                    invoiceNumber: value,
                  }))
                }
                onInvoiceDateChange={(date) =>
                  setInvoiceDetails((prev) => ({ ...prev, date }))
                }
                onPaymentMethodChange={setPaymentMethod}
                onNotesChange={setNotes}
                onSaveDraft={() => {
                  /* Implement save draft functionality */
                }}
                onConfirmBill={confirmBill}
              />
            </Box>
          </Box>

          {/* Product Search Dialog - Google Material Design Style */}
          <ProductSearchDialog
            open={searchDialogOpen}
            searchTerm={searchTerm}
            searchResults={searchResults}
            isInterState={customer.isInterState}
            onClose={() => setSearchDialogOpen(false)}
            onSearchChange={setSearchTerm}
            onSelectProduct={addToBill}
          />

          {/* Customer Search Dialog - Google Material Design Style */}
          <CustomerSearchDialog
            open={customerSearchDialog}
            searchTerm={customerSearchTerm}
            searchResults={customerSearchResults}
            onClose={() => setCustomerSearchDialog(false)}
            onSearchChange={setCustomerSearchTerm}
            onSelectCustomer={selectCustomer}
          />

          {/* Snackbar - Google Material Design Style */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{
                width: "100%",
                borderRadius: '12px',
                backgroundColor: snackbar.severity === 'success'
                  ? darkMode ? 'rgba(52, 168, 83, 0.1)' : 'rgba(52, 168, 83, 0.05)'
                  : snackbar.severity === 'error'
                  ? darkMode ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)'
                  : snackbar.severity === 'warning'
                  ? darkMode ? 'rgba(251, 188, 4, 0.1)' : 'rgba(251, 188, 4, 0.05)'
                  : darkMode ? 'rgba(138, 180, 248, 0.1)' : 'rgba(26, 115, 232, 0.05)',
                border: `1px solid ${
                  snackbar.severity === 'success'
                    ? darkMode ? 'rgba(52, 168, 83, 0.2)' : 'rgba(52, 168, 83, 0.1)'
                    : snackbar.severity === 'error'
                    ? darkMode ? 'rgba(234, 67, 53, 0.2)' : 'rgba(234, 67, 53, 0.1)'
                    : snackbar.severity === 'warning'
                    ? darkMode ? 'rgba(251, 188, 4, 0.2)' : 'rgba(251, 188, 4, 0.1)'
                    : darkMode ? 'rgba(138, 180, 248, 0.2)' : 'rgba(26, 115, 232, 0.1)'
                }`,
                color: snackbar.severity === 'success'
                  ? darkMode ? '#81c995' : '#1e7e34'
                  : snackbar.severity === 'error'
                  ? darkMode ? '#f28b82' : '#c5221f'
                  : snackbar.severity === 'warning'
                  ? darkMode ? '#fdd663' : '#b45a1c'
                  : darkMode ? '#8ab4f8' : '#1a73e8',
                '& .MuiAlert-icon': {
                  color: 'inherit',
                },
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Backdrop for loading - Google Material Design Style */}
          <Backdrop
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
            }}
            open={isSubmitting}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  backgroundColor: darkMode ? '#303134' : '#ffffff',
                  border: `1px solid ${darkMode ? '#3c4043' : '#dadce0'}`,
                  boxShadow: darkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08)',
                }}
              >
                <CircularProgress
                  size={48}
                  sx={{
                    color: darkMode ? '#8ab4f8' : '#1a73e8',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: darkMode ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {isOnline ? "Creating Bill..." : "Saving Bill Locally..."}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }}
                >
                  Please wait while we process your request
                </Typography>
              </Paper>
            </Box>
          </Backdrop>
        </Container>
      </MainLayout>
    </LocalizationProvider>
  );
}