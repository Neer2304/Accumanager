// app/api/billing/recurring/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RecurringInvoice from "@/models/RecurringInvoice";
import Customer from "@/models/Customer";
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

// Helper function to calculate next invoice date
const calculateNextInvoiceDate = (
  startDate: Date,
  frequency: string,
  interval: number
): Date => {
  const now = new Date();
  let nextDate = new Date(startDate);

  // Find the next date after today
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
};

// GET /api/billing/recurring - Get all recurring invoices
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/billing/recurring - Fetching recurring invoices...");

    const userId = getUserId(request);
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const frequency = searchParams.get("frequency");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { userId };
    if (status && status !== "all") query.status = status;
    if (frequency && frequency !== "all") query.frequency = frequency;

    console.log("📊 Query:", { userId, status, frequency, page, limit });

    // Fetch recurring invoices with customer details
    const recurringInvoices = await RecurringInvoice.find(query)
      .populate({
        path: "customerId",
        select: "name email phone company",
      })
      .sort({ nextInvoiceDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await RecurringInvoice.countDocuments(query);

    // Transform the data for frontend
    const transformedInvoices = recurringInvoices.map((invoice) => ({
      _id: invoice._id.toString(),
      name: invoice.name,
      customer: {
        id: invoice.customerId?._id?.toString() || "",
        name: invoice.customerId?.name || "Unknown Customer",
        email: invoice.customerId?.email || "",
        phone: invoice.customerId?.phone || "",
      },
      frequency: invoice.frequency,
      interval: invoice.interval,
      startDate: invoice.startDate.toISOString(),
      endDate: invoice.endDate?.toISOString(),
      nextInvoiceDate: invoice.nextInvoiceDate.toISOString(),
      totalInvoices: invoice.totalGenerated,
      amount: invoice.totalAmount,
      status: invoice.status,
      lastInvoiceDate: invoice.lastGeneratedAt?.toISOString(),
      items: invoice.items.map((item:any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      notes: invoice.notes,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    }));

    console.log(`✅ Found ${transformedInvoices.length} recurring invoices`);

    return NextResponse.json({
      success: true,
      recurringInvoices: transformedInvoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Recurring invoices fetched successfully",
    });
  } catch (error: any) {
    console.error("❌ GET /api/billing/recurring error:", error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch recurring invoices",
        recurringInvoices: [],
      },
      { status: 500 }
    );
  }
}

// POST /api/billing/recurring - Create new recurring invoice
export async function POST(request: NextRequest) {
  try {
    console.log("📝 POST /api/billing/recurring - Creating recurring invoice...");

    const userId = getUserId(request);
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      customerId,
      frequency,
      interval = 1,
      startDate,
      endDate,
      items,
      notes,
      status = "active",
    } = body;

    console.log("📦 Request body:", {
      name,
      customerId,
      frequency,
      interval,
      startDate,
      hasItems: items?.length,
    });

    // Validation
    if (!name || !customerId || !frequency || !startDate || !items?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, customerId, frequency, startDate, items",
        },
        { status: 400 }
      );
    }

    // Check if customer exists and belongs to user
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

    // Calculate totals
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

    const totalAmount = subtotal - totalDiscount + totalTax;

    // Calculate dates
    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : undefined;
    const nextInvoiceDate = calculateNextInvoiceDate(startDateObj, frequency, interval);

    // Create recurring invoice
    const recurringInvoice = new RecurringInvoice({
      userId,
      name,
      customerId,
      frequency,
      interval,
      startDate: startDateObj,
      endDate: endDateObj,
      nextInvoiceDate,
      items: processedItems,
      subtotal,
      totalDiscount,
      totalTax,
      totalAmount,
      notes,
      status,
      totalGenerated: 0,
    });

    await recurringInvoice.save();

    // Populate customer data for response
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

    console.log("✅ Recurring invoice created:", recurringInvoice._id);

    return NextResponse.json({
      success: true,
      recurringInvoice: responseData,
      message: "Recurring invoice created successfully",
    });
  } catch (error: any) {
    console.error("❌ POST /api/billing/recurring error:", error);

    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create recurring invoice",
      },
      { status: 500 }
    );
  }
}