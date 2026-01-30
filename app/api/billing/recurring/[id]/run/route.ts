// app/api/billing/recurring/[id]/run/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RecurringInvoice from "@/models/RecurringInvoice";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

// Helper function to get user ID from token
const getUserId = (request: NextRequest) => {
  const authToken = request.cookies.get("auth_token")?.value;
  if (!authToken) throw new Error("Unauthorized");
  
  const decoded = verifyToken(authToken);
  if (!decoded.userId) throw new Error("Invalid token");
  
  return decoded.userId.toString();
};

// POST /api/billing/recurring/[id]/run - Generate invoice now
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🚀 POST /api/billing/recurring/${params.id}/run - Generating invoice...`);

    const userId = getUserId(request);
    await connectToDatabase();

    // Find recurring invoice
    const recurringInvoice = await RecurringInvoice.findOne({
      _id: params.id,
      userId,
    }).populate({
      path: "customerId",
      select: "name email phone company address state city pincode gstin isInterState",
    });

    if (!recurringInvoice) {
      return NextResponse.json(
        { success: false, message: "Recurring invoice not found" },
        { status: 404 }
      );
    }

    // Check if recurring invoice is active
    if (recurringInvoice.status !== "active") {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot generate invoice. Recurring invoice is ${recurringInvoice.status}` 
        },
        { status: 400 }
      );
    }

    // Check if end date has passed
    if (recurringInvoice.endDate && new Date() > recurringInvoice.endDate) {
      recurringInvoice.status = "completed";
      await recurringInvoice.save();
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Recurring invoice has ended" 
        },
        { status: 400 }
      );
    }

    const customer = recurringInvoice.customerId;

    // Process items and calculate totals
    const processedItems = [];
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTaxableAmount = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    // Check stock and process items
    for (const item of recurringInvoice.items) {
      let product = null;
      if (item.productId) {
        product = await Product.findOne({
          _id: item.productId,
          userId,
        });
      }

      const itemTotal = item.price * item.quantity;
      const discountAmount = (itemTotal * (item.discount || 0)) / 100;
      const taxableAmount = itemTotal - discountAmount;

      let cgstAmount = 0;
      let sgstAmount = 0;
      let igstAmount = 0;

      // Calculate GST based on customer location
      if (customer.isInterState) {
        igstAmount = (taxableAmount * (item.taxRate || 0)) / 100;
      } else {
        cgstAmount = (taxableAmount * (item.taxRate || 0)) / 100 / 2;
        sgstAmount = cgstAmount;
      }

      const itemNetTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount;

      processedItems.push({
        productId: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount || 0,
        taxableAmount,
        cgstRate: customer.isInterState ? 0 : (item.taxRate || 0) / 2,
        sgstRate: customer.isInterState ? 0 : (item.taxRate || 0) / 2,
        igstRate: customer.isInterState ? (item.taxRate || 0) : 0,
        cgstAmount,
        sgstAmount,
        igstAmount,
        total: itemNetTotal,
        stockDeducted: false, // You can add stock deduction logic here if needed
      });

      subtotal += itemTotal;
      totalDiscount += discountAmount;
      totalTaxableAmount += taxableAmount;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;
      totalIgst += igstAmount;
    }

    const grandTotal = totalTaxableAmount + totalCgst + totalSgst + totalIgst;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Create order
    const order = new Order({
      invoiceNumber,
      invoiceDate: new Date(),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        address: customer.address,
        state: customer.state,
        city: customer.city,
        pincode: customer.pincode,
        gstin: customer.gstin,
        isInterState: customer.isInterState,
        customerId: customer._id,
      },
      items: processedItems,
      subtotal,
      totalDiscount,
      totalTaxableAmount,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal,
      paymentMethod: "bank_transfer",
      paymentStatus: "pending",
      status: "draft",
      notes: recurringInvoice.notes || "",
      userId,
      metadata: {
        recurringInvoiceId: recurringInvoice._id,
        isRecurring: true,
      },
    });

    await order.save();

    // Update recurring invoice
    recurringInvoice.totalGenerated += 1;
    recurringInvoice.lastGeneratedAt = new Date();
    
    // Calculate next invoice date
    let nextDate = new Date(recurringInvoice.nextInvoiceDate);
    switch (recurringInvoice.frequency) {
      case "daily":
        nextDate = addDays(nextDate, recurringInvoice.interval);
        break;
      case "weekly":
        nextDate = addWeeks(nextDate, recurringInvoice.interval);
        break;
      case "monthly":
        nextDate = addMonths(nextDate, recurringInvoice.interval);
        break;
      case "yearly":
        nextDate = addYears(nextDate, recurringInvoice.interval);
        break;
    }
    recurringInvoice.nextInvoiceDate = nextDate;

    // Check if recurring invoice has ended
    if (recurringInvoice.endDate && nextDate > recurringInvoice.endDate) {
      recurringInvoice.status = "completed";
    }

    await recurringInvoice.save();

    // Update customer's total spent
    await Customer.findByIdAndUpdate(customer._id, {
      $inc: { totalSpent: grandTotal },
      lastOrderDate: new Date(),
    });

    console.log("✅ Invoice generated successfully:", order._id);

    return NextResponse.json({
      success: true,
      invoice: {
        id: order._id.toString(),
        invoiceNumber: order.invoiceNumber,
        amount: order.grandTotal,
        date: order.invoiceDate.toISOString(),
      },
      nextInvoiceDate: recurringInvoice.nextInvoiceDate.toISOString(),
      message: "Invoice generated successfully",
    });
  } catch (error: any) {
    console.error(`❌ POST /api/billing/recurring/${params.id}/run error:`, error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to generate invoice",
      },
      { status: 500 }
    );
  }
}