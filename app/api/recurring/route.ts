// app/api/recurring/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RecurringInvoice from "@/models/RecurringInvoice";
import { verifyToken } from "@/lib/jwt";
import { addDays, addMonths, addWeeks, addYears, parseISO } from "date-fns";

// GET /api/recurring - Get all recurring invoices
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    const userId = decoded.userId;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const frequency = searchParams.get("frequency");

    const query: any = { userId };
    if (status && status !== "all") query.status = status;
    if (frequency && frequency !== "all") query.frequency = frequency;

    const recurringInvoices = await RecurringInvoice.find(query)
      .populate("customer", "name email")
      .sort({ nextInvoiceDate: 1 });

    return NextResponse.json({
      success: true,
      recurringInvoices,
    });
  } catch (error: any) {
    console.error("Get recurring invoices error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/recurring - Create new recurring invoice
export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    const userId = decoded.userId;

    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      customerId,
      templateId,
      frequency,
      interval,
      startDate,
      endDate,
      items,
      notes,
    } = body;

    // Validation
    if (!name || !customerId || !frequency || !startDate || !items?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Calculate next invoice date
    const start = parseISO(startDate);
    let nextInvoiceDate: Date;

    switch (frequency) {
      case "daily":
        nextInvoiceDate = addDays(start, interval || 1);
        break;
      case "weekly":
        nextInvoiceDate = addWeeks(start, interval || 1);
        break;
      case "monthly":
        nextInvoiceDate = addMonths(start, interval || 1);
        break;
      case "yearly":
        nextInvoiceDate = addYears(start, interval || 1);
        break;
      default:
        nextInvoiceDate = addDays(start, 1);
    }

    const recurringInvoice = new RecurringInvoice({
      userId,
      name,
      customer: customerId,
      template: templateId,
      frequency,
      interval: interval || 1,
      startDate: start,
      endDate: endDate ? parseISO(endDate) : null,
      nextInvoiceDate,
      items,
      totalAmount,
      notes,
      status: "active",
      totalGenerated: 0,
    });

    await recurringInvoice.save();

    return NextResponse.json({
      success: true,
      recurringInvoice,
      message: "Recurring invoice created successfully",
    });
  } catch (error: any) {
    console.error("Create recurring invoice error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}