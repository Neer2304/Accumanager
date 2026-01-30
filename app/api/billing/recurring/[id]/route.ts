// app/api/billing/recurring/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RecurringInvoice from "@/models/RecurringInvoice";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
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

// GET /api/billing/recurring/[id] - Get single recurring invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 GET /api/billing/recurring/${params.id} - Fetching recurring invoice...`);

    const userId = getUserId(request);
    await connectToDatabase();

    // Find recurring invoice
    const recurringInvoice = await RecurringInvoice.findOne({
      _id: params.id,
      userId,
    }).populate({
      path: "customerId",
      select: "name email phone company address state city pincode gstin",
    });

    if (!recurringInvoice) {
      return NextResponse.json(
        { success: false, message: "Recurring invoice not found" },
        { status: 404 }
      );
    }

    // Get generated invoices
    const generatedInvoices = await Order.find({
      userId,
      "metadata.recurringInvoiceId": params.id,
    })
      .sort({ invoiceDate: -1 })
      .limit(10)
      .select("invoiceNumber invoiceDate grandTotal paymentStatus status")
      .lean();

    const responseData = {
      _id: recurringInvoice._id.toString(),
      name: recurringInvoice.name,
      customer: {
        id: recurringInvoice.customerId?._id?.toString() || "",
        name: recurringInvoice.customerId?.name || "Unknown Customer",
        email: recurringInvoice.customerId?.email || "",
        phone: recurringInvoice.customerId?.phone || "",
        company: recurringInvoice.customerId?.company || "",
        address: recurringInvoice.customerId?.address || "",
        state: recurringInvoice.customerId?.state || "",
        city: recurringInvoice.customerId?.city || "",
        pincode: recurringInvoice.customerId?.pincode || "",
        gstin: recurringInvoice.customerId?.gstin || "",
      },
      frequency: recurringInvoice.frequency,
      interval: recurringInvoice.interval,
      startDate: recurringInvoice.startDate.toISOString(),
      endDate: recurringInvoice.endDate?.toISOString(),
      nextInvoiceDate: recurringInvoice.nextInvoiceDate.toISOString(),
      totalInvoices: recurringInvoice.totalGenerated,
      amount: recurringInvoice.totalAmount,
      status: recurringInvoice.status,
      lastInvoiceDate: recurringInvoice.lastGeneratedAt?.toISOString(),
      items: recurringInvoice.items.map((item:any) => ({
        productId: item.productId?.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        taxRate: item.taxRate,
        total: item.price * item.quantity,
      })),
      subtotal: recurringInvoice.subtotal,
      totalDiscount: recurringInvoice.totalDiscount,
      totalTax: recurringInvoice.totalTax,
      totalAmount: recurringInvoice.totalAmount,
      notes: recurringInvoice.notes,
      generatedInvoices: generatedInvoices.map((invoice) => ({
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate?.toISOString(),
        amount: invoice.grandTotal,
        paymentStatus: invoice.paymentStatus,
        status: invoice.status,
      })),
      createdAt: recurringInvoice.createdAt.toISOString(),
      updatedAt: recurringInvoice.updatedAt.toISOString(),
    };

    console.log("✅ Recurring invoice found:", params.id);

    return NextResponse.json({
      success: true,
      recurringInvoice: responseData,
      message: "Recurring invoice fetched successfully",
    });
  } catch (error: any) {
    console.error(`❌ GET /api/billing/recurring/${params.id} error:`, error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch recurring invoice",
      },
      { status: 500 }
    );
  }
}

// PUT /api/billing/recurring/[id] - Update recurring invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📝 PUT /api/billing/recurring/${params.id} - Updating recurring invoice...`);

    const userId = getUserId(request);
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      customerId,
      frequency,
      interval,
      startDate,
      endDate,
      items,
      notes,
      status,
    } = body;

    // Find recurring invoice
    const recurringInvoice = await RecurringInvoice.findOne({
      _id: params.id,
      userId,
    });

    if (!recurringInvoice) {
      return NextResponse.json(
        { success: false, message: "Recurring invoice not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) recurringInvoice.name = name;
    if (notes !== undefined) recurringInvoice.notes = notes;
    if (status !== undefined) recurringInvoice.status = status;

    // Update customer if provided
    if (customerId) {
      const customer = await Customer.findOne({
        _id: customerId,
        userId,
      });

      if (!customer) {
        return NextResponse.json(
          { success: false, message: "Customer not found" },
          { status: 404 }
        );
      }
      recurringInvoice.customerId = customerId;
    }

    // Update frequency and interval
    if (frequency) recurringInvoice.frequency = frequency;
    if (interval) recurringInvoice.interval = interval;

    // Update dates
    if (startDate) {
      recurringInvoice.startDate = new Date(startDate);
    }
    if (endDate !== undefined) {
      recurringInvoice.endDate = endDate ? new Date(endDate) : undefined;
    }

    // Update items if provided
    if (items) {
      let subtotal = 0;
      let totalDiscount = 0;
      let totalTax = 0;

      const processedItems = items.map((item: any) => {
        const itemTotal = item.price * item.quantity;
        const discountAmount = (itemTotal * (item.discount || 0)) / 100;
        const taxableAmount = itemTotal - discountAmount;
        const taxAmount = (taxableAmount * (item.taxRate || 0)) / 100;

        subtotal += itemTotal;
        totalDiscount += discountAmount;
        totalTax += taxAmount;

        return {
          productId: item.productId,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
          taxRate: item.taxRate || 0,
        };
      });

      recurringInvoice.items = processedItems;
      recurringInvoice.subtotal = subtotal;
      recurringInvoice.totalDiscount = totalDiscount;
      recurringInvoice.totalTax = totalTax;
      recurringInvoice.totalAmount = subtotal - totalDiscount + totalTax;
    }

    // Recalculate next invoice date if dates/frequency changed
    if (frequency || startDate || interval) {
      recurringInvoice.nextInvoiceDate = calculateNextInvoiceDate(
        recurringInvoice.startDate,
        recurringInvoice.frequency,
        recurringInvoice.interval
      );
    }

    // Check if recurring invoice has ended
    if (recurringInvoice.endDate && new Date() > recurringInvoice.endDate) {
      recurringInvoice.status = "completed";
    }

    await recurringInvoice.save();

    // Populate customer data
    await recurringInvoice.populate({
      path: "customerId",
      select: "name email phone company",
    });

    const responseData = {
      _id: recurringInvoice._id.toString(),
      name: recurringInvoice.name,
      customer: {
        id: recurringInvoice.customerId?._id?.toString() || "",
        name: recurringInvoice.customerId?.name || "Unknown Customer",
        email: recurringInvoice.customerId?.email || "",
        phone: recurringInvoice.customerId?.phone || "",
      },
      frequency: recurringInvoice.frequency,
      interval: recurringInvoice.interval,
      startDate: recurringInvoice.startDate.toISOString(),
      endDate: recurringInvoice.endDate?.toISOString(),
      nextInvoiceDate: recurringInvoice.nextInvoiceDate.toISOString(),
      totalInvoices: recurringInvoice.totalGenerated,
      amount: recurringInvoice.totalAmount,
      status: recurringInvoice.status,
      items: recurringInvoice.items.map((item:any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      notes: recurringInvoice.notes,
      createdAt: recurringInvoice.createdAt.toISOString(),
      updatedAt: recurringInvoice.updatedAt.toISOString(),
    };

    console.log("✅ Recurring invoice updated:", params.id);

    return NextResponse.json({
      success: true,
      recurringInvoice: responseData,
      message: "Recurring invoice updated successfully",
    });
  } catch (error: any) {
    console.error(`❌ PUT /api/billing/recurring/${params.id} error:`, error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update recurring invoice",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/billing/recurring/[id] - Partial update (status, next date)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔧 PATCH /api/billing/recurring/${params.id} - Updating status...`);

    const userId = getUserId(request);
    await connectToDatabase();

    const body = await request.json();
    const { status, nextInvoiceDate } = body;

    // Find recurring invoice
    const recurringInvoice = await RecurringInvoice.findOne({
      _id: params.id,
      userId,
    });

    if (!recurringInvoice) {
      return NextResponse.json(
        { success: false, message: "Recurring invoice not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (status !== undefined) {
      recurringInvoice.status = status;
    }
    if (nextInvoiceDate !== undefined) {
      recurringInvoice.nextInvoiceDate = new Date(nextInvoiceDate);
    }

    await recurringInvoice.save();

    console.log("✅ Recurring invoice status updated:", params.id, "Status:", status);

    return NextResponse.json({
      success: true,
      message: "Recurring invoice updated successfully",
      recurringInvoice: {
        _id: recurringInvoice._id.toString(),
        status: recurringInvoice.status,
        nextInvoiceDate: recurringInvoice.nextInvoiceDate.toISOString(),
        updatedAt: recurringInvoice.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error(`❌ PATCH /api/billing/recurring/${params.id} error:`, error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update recurring invoice",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/billing/recurring/[id] - Delete recurring invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ DELETE /api/billing/recurring/${params.id} - Deleting recurring invoice...`);

    const userId = getUserId(request);
    await connectToDatabase();

    const recurringInvoice = await RecurringInvoice.findOneAndDelete({
      _id: params.id,
      userId,
    });

    if (!recurringInvoice) {
      return NextResponse.json(
        { success: false, message: "Recurring invoice not found" },
        { status: 404 }
      );
    }

    console.log("✅ Recurring invoice deleted:", params.id);

    return NextResponse.json({
      success: true,
      message: "Recurring invoice deleted successfully",
    });
  } catch (error: any) {
    console.error(`❌ DELETE /api/billing/recurring/${params.id} error:`, error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete recurring invoice",
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate next invoice date
function calculateNextInvoiceDate(startDate: Date, frequency: string, interval: number): Date {
  const now = new Date();
  let nextDate = new Date(startDate);

  while (nextDate <= now) {
    switch (frequency) {
      case "daily":
        nextDate = addDays(nextDate, interval);
        break;
      case "weekly":
        nextDate = addWeeks(nextDate, interval);
        break;
      case "monthly":
        nextDate = addMonths(nextDate, interval);
        break;
      case "yearly":
        nextDate = addYears(nextDate, interval);
        break;
      default:
        nextDate = addDays(nextDate, interval);
    }
  }

  return nextDate;
}