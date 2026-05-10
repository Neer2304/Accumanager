// app/api/billing/route.ts - COMPLETELY FIXED
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import { verifyToken } from "@/lib/jwt";
import { PaymentService } from "@/services/paymentService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DecodedToken {
  userId: string;
  role?: string;
  email?: string;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string | { line1?: string; line2?: string; city?: string; state?: string; pincode?: string };
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  isInterState?: boolean;
}

interface OrderItem {
  productId: string;
  variationId?: string;
  variationName?: string;
  name: string;
  sku?: string;
  hsnCode?: string;
  price: number;
  quantity: number;
  discount?: number | { type: string; value: number };
  taxableAmount?: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  total?: number;
  stockDeducted?: boolean;
  stockDeductedAt?: Date;
}

interface Variation {
  _id?: { toString(): string };
  quantity?: number;
}

interface ProductDocument {
  _id: string;
  name: string;
  sku?: string;
  pricing?: {
    gstRate?: number;
    hsnCode?: string;
  };
  inventory?: {
    quantity: number;
    availableQuantity?: number;
    reservedQuantity?: number;
    stockStatus?: string;
  };
  attributes?: Variation[];
  save(): Promise<ProductDocument>;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
}

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
}

// FIX: Build proper address object for Customer model
function buildAddressObject(customer: CustomerData): Address {
  let line1 = '';
  let line2 = '';
  let city = '';
  let state = '';
  let pincode = '';
  
  // Handle address if it's an object
  if (customer.address && typeof customer.address === 'object') {
    line1 = customer.address.line1 || '';
    line2 = customer.address.line2 || '';
    city = customer.address.city || '';
    state = customer.address.state || '';
    pincode = customer.address.pincode || '';
  } else if (customer.address && typeof customer.address === 'string') {
    line1 = customer.address;
  }
  
  // Override with direct fields if provided
  if (customer.city) city = customer.city;
  if (customer.state) state = customer.state;
  if (customer.pincode) pincode = customer.pincode;
  
  return {
    line1,
    line2,
    city,
    state,
    pincode,
    country: 'India'
  };
}

// Build address string for order display
function buildAddressStringForOrder(customer: CustomerData): string {
  const parts: string[] = [];
  
  if (customer.address && typeof customer.address === 'object') {
    if (customer.address.line1) parts.push(customer.address.line1);
    if (customer.address.line2) parts.push(customer.address.line2);
  } else if (customer.address && typeof customer.address === 'string') {
    parts.push(customer.address);
  }
  
  if (customer.city) parts.push(customer.city);
  if (customer.state) parts.push(customer.state);
  if (customer.pincode) parts.push(customer.pincode);
  
  return parts.join(', ');
}

function getDiscountAmount(itemTotal: number, discount: OrderItem['discount']): { amount: number; value: number } {
  if (!discount) return { amount: 0, value: 0 };
  
  if (typeof discount === 'number') {
    return { amount: (itemTotal * discount) / 100, value: discount };
  }
  
  if (discount.type === 'percentage') {
    const value = discount.value || 0;
    return { amount: (itemTotal * value) / 100, value };
  }
  
  const value = discount.value || 0;
  return { amount: value, value };
}

// ─── POST Handler - COMPLETELY FIXED ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    console.log("💰 POST /api/billing - Starting...");

    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      console.log("❌ No auth token in billing request");
      return NextResponse.json({ 
        success: false,
        message: "Unauthorized" 
      }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = verifyToken(authToken) as DecodedToken;
      userId = decoded.userId?.toString();
      
      if (!userId) {
        throw new Error("Invalid user ID in token");
      }
    } catch (authErr) {
      console.error("❌ Auth error:", authErr);
      return NextResponse.json({ 
        success: false,
        message: "Invalid or expired token" 
      }, { status: 401 });
    }

    // Check subscription
    try {
      const subscription = await PaymentService.checkSubscription(userId);
      if (!subscription.isActive) {
        return NextResponse.json({
          success: false,
          message: "Your subscription has expired. Please renew to create bills.",
        }, { status: 403 });
      }

      const limitCheck = await PaymentService.checkUsageLimit(
        userId,
        "invoices",
        1,
      );
      if (!limitCheck.canProceed) {
        return NextResponse.json({
          success: false,
          message: `You've reached your invoice limit (${limitCheck.currentUsage}/${limitCheck.limit}). Please upgrade your plan.`,
        }, { status: 403 });
      }
    } catch (subErr) {
      console.error("❌ Subscription check error:", subErr);
    }

    console.log("👤 Creating bill for user:", userId);

    await connectToDatabase();
    console.log("✅ Database connected for billing");

    const body = await request.json();
    const { 
      items, 
      customer, 
      invoiceDetails, 
      paymentMethod = 'cash',
      paymentStatus = 'pending',
      amountPaid = 0,
      notes,
      dueDate 
    } = body;

    console.log("📦 Billing data:", {
      itemsCount: items?.length,
      customer: customer?.name,
      customerPhone: customer?.phone,
      paymentMethod,
      amountPaid,
    });

    if (!items || !items.length) {
      return NextResponse.json({
        success: false,
        message: "At least one item is required",
      }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.phone) {
      return NextResponse.json({
        success: false,
        message: "Customer name and phone are required",
      }, { status: 400 });
    }

    // ─── CREATE OR UPDATE CUSTOMER (FIXED) ───────────────────────────────────
    let customerRecord = await Customer.findOne({
      phone: customer.phone,
      userId: userId,
    });

    const addressObject = buildAddressObject(customer);

    if (!customerRecord) {
      console.log("👥 Creating new customer automatically...");

      try {
        const customerLimitCheck = await PaymentService.checkUsageLimit(
          userId,
          "customers",
          1,
        );
        if (!customerLimitCheck.canProceed) {
          return NextResponse.json({
            success: false,
            message: `Customer limit reached (${customerLimitCheck.currentUsage}/${customerLimitCheck.limit}). Cannot create new customer.`,
          }, { status: 403 });
        }
      } catch (limitErr) {
        console.warn("Customer limit check failed:", limitErr);
      }

      // Create customer with PROPER address object
      customerRecord = new Customer({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        company: customer.company || "",
        address: addressObject,
        city: addressObject.city,
        state: addressObject.state,
        pincode: addressObject.pincode,
        gstin: customer.gstin || "",
        isInterState: customer.isInterState || false,
        userId: userId,
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        creditBalance: 0,
        tags: [],
        notes: [],
        isActive: true,
        isBlacklisted: false,
      });

      await customerRecord.save();
      console.log("✅ New customer created with ID:", customerRecord._id);
      console.log("   Customer address:", JSON.stringify(customerRecord.address));

      try {
        await PaymentService.updateUsage(userId, "customers", 1);
      } catch (usageErr) {
        console.error("Failed to update customer usage:", usageErr);
      }
      
    } else {
      console.log("👥 Existing customer found:", customerRecord._id);

      // Update existing customer with new address if needed
      const updates: any = {};
      
      if (customer.email && customer.email !== customerRecord.email) {
        updates.email = customer.email;
      }
      
      if (customer.company && customer.company !== customerRecord.company) {
        updates.company = customer.company;
      }
      
      // Update address if provided
      if (customer.address || customer.city || customer.state || customer.pincode) {
        updates.address = addressObject;
        updates.city = addressObject.city;
        updates.state = addressObject.state;
        updates.pincode = addressObject.pincode;
      }
      
      if (customer.gstin && customer.gstin !== customerRecord.gstin) {
        updates.gstin = customer.gstin.toUpperCase();
      }
      
      if (customer.isInterState !== undefined && customer.isInterState !== customerRecord.isInterState) {
        updates.isInterState = customer.isInterState;
      }

      if (Object.keys(updates).length > 0) {
        await Customer.findByIdAndUpdate(customerRecord._id, { $set: updates });
        console.log("✅ Customer details updated");
      }
    }

    // ─── PROCESS ITEMS ───────────────────────────────────────────────────────
    const processedItems: OrderItem[] = [];
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const itemsForInventoryDeduction: any[] = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        userId: userId,
      }) as ProductDocument | null;

      if (!product) {
        return NextResponse.json({
          success: false,
          message: `Product not found: ${item.name || item.productId}`,
        }, { status: 400 });
      }

      let availableStock = 0;
      if (item.variationId) {
        if (product.attributes && Array.isArray(product.attributes)) {
          const variation = product.attributes.find(
            (v: Variation) => v._id?.toString() === item.variationId
          );
          availableStock = variation?.quantity || 0;
        } else {
          availableStock = 0;
        }
      } else {
        availableStock = product.inventory?.quantity || 0;
      }

      if (availableStock < item.quantity) {
        return NextResponse.json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${availableStock}`,
        }, { status: 400 });
      }

      itemsForInventoryDeduction.push({
        productId: item.productId,
        product: product,
        variationId: item.variationId,
        quantity: item.quantity,
        productName: product.name,
      });

      const itemTotal = item.price * item.quantity;
      const { amount: discountAmount, value: discountValue } = getDiscountAmount(itemTotal, item.discount);
      
      const taxableAmount = itemTotal - discountAmount;

      const gstRate = product.pricing?.gstRate || 18;
      const cgstRate = gstRate / 2;
      const sgstRate = gstRate / 2;
      const igstRate = customer.isInterState ? gstRate : 0;

      let cgstAmount = 0;
      let sgstAmount = 0;
      let igstAmount = 0;

      if (customer.isInterState) {
        igstAmount = (taxableAmount * igstRate) / 100;
      } else {
        cgstAmount = (taxableAmount * cgstRate) / 100;
        sgstAmount = (taxableAmount * sgstRate) / 100;
      }

      const itemNetTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount;

      processedItems.push({
        productId: item.productId,
        variationId: item.variationId,
        name: product.name,
        variationName: item.variationName,
        sku: product.sku,
        hsnCode: product.pricing?.hsnCode || "",
        price: item.price,
        quantity: item.quantity,
        discount: discountValue,
        taxableAmount,
        cgstRate,
        sgstRate,
        igstRate,
        cgstAmount,
        sgstAmount,
        igstAmount,
        total: itemNetTotal,
        stockDeducted: false,
      });

      subtotal += itemTotal;
      totalDiscount += discountAmount;
      totalTaxableAmount += taxableAmount;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;
      totalIgst += igstAmount;
    }

    const grandTotal = totalTaxableAmount + totalCgst + totalSgst + totalIgst;
    const roundOff = Math.round(grandTotal) - grandTotal;
    const finalGrandTotal = Math.round(grandTotal);

    const amountPaidValue = amountPaid || 0;
    const adjustedAmountPaid = Math.min(amountPaidValue, finalGrandTotal);
    const amountDueValue = finalGrandTotal - adjustedAmountPaid;
    const overpaidAmount = amountPaidValue > finalGrandTotal ? amountPaidValue - finalGrandTotal : 0;
    
    if (overpaidAmount > 0) {
      console.log(`💰 Customer overpaid by ${overpaidAmount}. Amount capped at ${finalGrandTotal}`);
    }

    const paymentDetails = {
      method: paymentMethod,
      status: paymentStatus === 'paid' ? 'completed' : paymentStatus === 'partial' ? 'processing' : 'pending',
      amount: adjustedAmountPaid,
      paidAt: paymentStatus === 'paid' ? new Date() : null,
      notes: overpaidAmount > 0 ? `Customer overpaid by ${overpaidAmount}. Excess amount will be adjusted.` : undefined,
    };

    const orderNumber = generateOrderNumber();
    const invoiceNumber = invoiceDetails?.invoiceNumber || generateInvoiceNumber();
    const orderAddressString = buildAddressStringForOrder(customer);

    // ─── CREATE ORDER ───────────────────────────────────────────────────────
    const order = new Order({
      orderNumber,
      invoiceNumber,
      orderDate: new Date(),
      invoiceDate: invoiceDetails?.date ? new Date(invoiceDetails.date) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      customer: {
        customerId: customerRecord._id.toString(),
        name: customer.name,
        phone: customer.phone,
        email: customer.email || customerRecord.email || "",
        gstin: customer.gstin || customerRecord.gstin || "",
        address: orderAddressString || "",
        state: customer.state || customerRecord.state || "",
        isInterState: customer.isInterState || customerRecord.isInterState || false,
      },
      items: processedItems,
      subtotal,
      totalDiscount,
      totalTaxableAmount,
      totalCgst,
      totalSgst,
      totalIgst,
      roundOff,
      grandTotal: finalGrandTotal,
      amountPaid: adjustedAmountPaid,
      amountDue: amountDueValue,
      payment: paymentDetails,
      status: adjustedAmountPaid >= finalGrandTotal ? 'confirmed' : 'draft',
      paymentStatus: adjustedAmountPaid >= finalGrandTotal ? 'paid' : adjustedAmountPaid > 0 ? 'partial' : 'pending',
      fulfillmentStatus: 'pending',
      inventoryStatus: {
        allDeducted: false,
      },
      notes: overpaidAmount > 0 
        ? `${notes || ''} Note: Customer overpaid by ${overpaidAmount}. Excess amount will be adjusted.` 
        : notes || "",
      userId: userId,
      createdBy: userId,
    });

    console.log("💾 Saving order to database...");
    console.log("💰 Amount details:", {
      grandTotal: finalGrandTotal,
      amountPaid: adjustedAmountPaid,
      amountDue: amountDueValue,
      overpaid: overpaidAmount,
    });

    await order.save();

    // ─── UPDATE CUSTOMER STATISTICS ─────────────────────────────────────────
    await Customer.findByIdAndUpdate(customerRecord._id, {
      $inc: { 
        totalOrders: 1,
        totalSpent: finalGrandTotal 
      },
      $set: {
        lastOrderDate: new Date(),
        lastOrderId: order._id,
        updatedAt: new Date()
      }
    });

    console.log("✅ Customer statistics updated");

    // ─── DEDUCT INVENTORY IF PAID ───────────────────────────────────────────
    const shouldDeductInventory = adjustedAmountPaid >= finalGrandTotal;
    
    if (shouldDeductInventory) {
      console.log("📦 Deducting inventory from products...");
      let deductionSuccessful = true;
      let deductionError: string | null = null;

      for (const item of itemsForInventoryDeduction) {
        try {
          const product = item.product;
          
          if (item.variationId) {
            if (product.attributes && Array.isArray(product.attributes) && product.attributes.length > 0) {
              const attributeIndex = product.attributes.findIndex(
                (v: Variation) => v._id?.toString() === item.variationId
              );

              if (attributeIndex !== -1 && product.attributes[attributeIndex]) {
                const attribute = product.attributes[attributeIndex];
                const currentQuantity = attribute.quantity || 0;
                
                if (currentQuantity >= item.quantity) {
                  attribute.quantity = currentQuantity - item.quantity;
                  
                  const orderItemIndex = order.items.findIndex(
                    (oi: OrderItem) => 
                      oi.productId.toString() === item.productId &&
                      oi.variationId?.toString() === item.variationId
                  );
                  if (orderItemIndex !== -1) {
                    order.items[orderItemIndex].stockDeducted = true;
                    order.items[orderItemIndex].stockDeductedAt = new Date();
                  }

                  console.log(`✅ Deducted ${item.quantity} from ${item.productName} variation (remaining: ${attribute.quantity})`);
                } else {
                  throw new Error(`Insufficient stock for variation: ${item.productName}. Available: ${currentQuantity}, Requested: ${item.quantity}`);
                }
              } else {
                throw new Error(`Variation not found for product: ${item.productName}`);
              }
            } else {
              throw new Error(`Product ${item.productName} has no attributes defined`);
            }
          } else {
            if (!product.inventory) {
              throw new Error(`Product ${item.productName} has no inventory data`);
            }
            
            const currentQuantity = product.inventory.quantity || 0;
            if (currentQuantity >= item.quantity) {
              product.inventory.quantity = currentQuantity - item.quantity;
              product.inventory.availableQuantity = product.inventory.quantity - (product.inventory.reservedQuantity || 0);
              
              if (product.inventory.quantity <= 0) {
                product.inventory.stockStatus = 'out_of_stock';
              } else {
                product.inventory.stockStatus = 'in_stock';
              }

              order.items.forEach((oi: OrderItem) => {
                if (oi.productId.toString() === item.productId && !oi.variationId) {
                  oi.stockDeducted = true;
                  oi.stockDeductedAt = new Date();
                }
              });

              console.log(`✅ Deducted ${item.quantity} from ${item.productName} (remaining: ${product.inventory.quantity})`);
            } else {
              throw new Error(`Insufficient stock for ${item.productName}. Available: ${currentQuantity}, Requested: ${item.quantity}`);
            }
          }

          await product.save();
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          console.error(`❌ Failed to deduct inventory for ${item.productName}:`, err);
          deductionSuccessful = false;
          deductionError = errorMessage;
          break;
        }
      }

      if (deductionSuccessful) {
        order.inventoryStatus = {
          allDeducted: true,
          deductedAt: new Date(),
        };
        console.log("✅ All inventory deducted successfully");
      } else {
        order.inventoryStatus = {
          allDeducted: false,
          reversalRequested: false,
          reversalCompleted: false,
          reversalReason: deductionError,
        };
        console.error("❌ Inventory deduction failed:", deductionError);
      }
      
      await order.save();
    }

    try {
      await PaymentService.updateUsage(userId, "invoices", 1);
    } catch (usageErr) {
      console.error("Failed to update invoice usage:", usageErr);
    }

    console.log("✅ Order saved successfully:", order._id);

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        grandTotal: order.grandTotal,
        amountPaid: order.amountPaid,
        amountDue: order.amountDue,
        status: order.status,
        paymentStatus: order.paymentStatus,
        customerId: customerRecord._id,
        items: order.items.map((item: OrderItem) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          stockDeducted: item.stockDeducted,
        })),
        overpaid: overpaidAmount > 0 ? overpaidAmount : undefined,
      },
      message: shouldDeductInventory 
        ? overpaidAmount > 0 
          ? `Invoice created with overpayment of ${overpaidAmount}. Amount adjusted to ${finalGrandTotal}. Inventory updated.`
          : "Invoice created and inventory updated successfully"
        : overpaidAmount > 0
          ? `Invoice created with overpayment of ${overpaidAmount}. Amount adjusted to ${finalGrandTotal}.`
          : "Invoice created successfully (inventory not deducted)",
    }, { status: 201 });

  } catch (err) {
    const error = err as { message?: string; name?: string; errors?: Record<string, { message: string }> };
    console.error("❌ Create bill error:", err);

    if (error.message?.includes("subscription") || error.message?.includes("limit")) {
      return NextResponse.json({ 
        success: false,
        message: error.message 
      }, { status: 403 });
    }

    if (error.message?.includes("Insufficient stock")) {
      return NextResponse.json({ 
        success: false,
        message: error.message 
      }, { status: 400 });
    }

    if (error.name === 'ValidationError' && error.errors) {
      const errors = Object.values(error.errors).map((err: { message: string }) => err.message);
      return NextResponse.json({ 
        success: false,
        message: errors.join(', ')
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false,
      message: error.message || "Internal server error" 
    }, { status: 500 });
  }
}

// ─── PATCH Handler - Reverse inventory ───────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    console.log("🔄 PATCH /api/billing - Reversing inventory...");

    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ 
        success: false,
        message: "Unauthorized" 
      }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = verifyToken(authToken) as DecodedToken;
      userId = decoded.userId?.toString();
      if (!userId) {
        throw new Error("Invalid user ID");
      }
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return NextResponse.json({ 
        success: false,
        message: "Invalid token" 
      }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { orderId, items, reason = "Order cancelled/returned" } = body;

    if (!orderId) {
      return NextResponse.json({ 
        success: false,
        message: "Order ID is required" 
      }, { status: 400 });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      return NextResponse.json({ 
        success: false,
        message: "Order not found" 
      }, { status: 404 });
    }

    if (order.inventoryStatus?.reversalCompleted) {
      return NextResponse.json({
        success: false,
        message: "Inventory already reversed for this order",
      }, { status: 400 });
    }

    const itemsToReverse = items || order.items;

    for (const item of itemsToReverse) {
      const product = await Product.findOne({
        _id: item.productId || item._id,
        userId: userId,
      }) as ProductDocument | null;

      if (!product) {
        console.warn(`Product not found for restock: ${item.productId || item._id}`);
        continue;
      }

      if (item.variationId) {
        if (product.attributes && Array.isArray(product.attributes) && product.attributes.length > 0) {
          const attributeIndex = product.attributes.findIndex(
            (v: Variation) => v._id?.toString() === item.variationId
          );

          if (attributeIndex !== -1 && product.attributes[attributeIndex]) {
            const attribute = product.attributes[attributeIndex];
            const currentQty = attribute.quantity || 0;
            attribute.quantity = currentQty + item.quantity;
            console.log(`✅ Restocked ${item.quantity} to ${product.name} variation (new total: ${attribute.quantity})`);
          } else {
            console.warn(`Variation not found for restock: ${item.productId || item._id}`);
          }
        } else {
          console.warn(`Product ${product.name} has no attributes for restock`);
        }
      } else {
        if (product.inventory) {
          const currentQty = product.inventory.quantity || 0;
          product.inventory.quantity = currentQty + item.quantity;
          product.inventory.availableQuantity = product.inventory.quantity - (product.inventory.reservedQuantity || 0);
          
          if (product.inventory.quantity > 0) {
            product.inventory.stockStatus = 'in_stock';
          }
          
          console.log(`✅ Restocked ${item.quantity} to ${product.name} (new total: ${product.inventory.quantity})`);
        } else {
          console.warn(`Product ${product.name} has no inventory data for restock`);
        }
      }

      await product.save();
    }

    order.status = "returned";
    order.fulfillmentStatus = "returned";
    order.inventoryStatus = {
      ...order.inventoryStatus,
      reversalRequested: true,
      reversalCompleted: true,
      reversalReason: reason,
    };
    order.updatedAt = new Date();
    order.cancelledAt = new Date();
    
    await order.save();

    console.log("✅ Inventory restocked successfully for order:", orderId);

    return NextResponse.json({
      success: true,
      message: "Inventory restocked and order updated",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        inventoryStatus: order.inventoryStatus,
        updatedAt: order.updatedAt,
      },
    });

  } catch (err) {
    const error = err as { message?: string };
    console.error("❌ Reverse inventory error:", err);
    return NextResponse.json({ 
      success: false,
      message: error.message || "Internal server error" 
    }, { status: 500 });
  }
}