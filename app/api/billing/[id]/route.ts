// app/api/billing/[id]/route.ts - UPDATED FOR NEW SCHEMAS
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

interface ProductImage {
  url: string;
  publicId: string;
  isPrimary?: boolean;
}

interface ProductDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  sku?: string;
  pricing?: {
    hsnCode?: string;
    [key: string]: unknown;
  };
  images?: ProductImage[];
}

interface OrderItem {
  productId?: mongoose.Types.ObjectId;
  variationId?: string;
  name: string;
  variationName?: string;
  sku?: string;
  hsnCode?: string;
  price: number;
  quantity: number;
  discount: number;
  taxableAmount: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
  stockDeducted?: boolean;
  stockDeductedAt?: Date;
}

interface Payment {
  method: string;
  status: string;
  amount: number;
  transactionId?: string;
  paidAt?: Date;
}

interface CustomerInfo {
  customerId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  gstin?: string;
  address?: string;
  state?: string;
  isInterState?: boolean;
}

interface CustomerDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  gstin?: string;
  isInterState?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  creditBalance?: number;
  createdAt?: Date;
}

interface OrderDocument {
  _id: mongoose.Types.ObjectId;
  userId: string;
  orderNumber: string;
  invoiceNumber: string;
  orderDate: Date;
  invoiceDate: Date;
  dueDate?: Date;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  roundOff: number;
  grandTotal: number;
  amountPaid: number;
  amountDue: number;
  payment: Payment;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  inventoryStatus: { allDeducted: boolean };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  save(): Promise<OrderDocument>;
}

interface UpdateBody {
  paymentStatus?: string;
  fulfillmentStatus?: string;
  status?: string;
  notes?: string;
  amountPaid?: number;
  paymentMethod?: string;
  transactionId?: string;
}

interface DeleteBody {
  permanent?: boolean;
}

interface ValidationError extends Error {
  name: string;
  errors: Record<string, { message: string }>;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function isInvoiceNumber(id: string): boolean {
  return id.startsWith("INV-");
}

function isOrderNumber(id: string): boolean {
  return id.startsWith("ORD-");
}

// ─── GET /api/billing/[id] ────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const id = params.id;

    console.log("📄 GET /api/billing/[id] - ID:", id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice ID is required",
        },
        { status: 400 },
      );
    }

    const isValidId = isValidObjectId(id);
    const isInvoice = isInvoiceNumber(id);
    const isOrder = isOrderNumber(id);

    if (!isValidId && !isInvoice && !isOrder) {
      console.log("❌ Invalid ID format:", id);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid invoice ID format",
          suggestion: "Please check the invoice number, order number, or ID",
        },
        { status: 400 },
      );
    }

    const authToken = request.cookies.get("auth_token")?.value;
    const authHeader = request.headers.get("authorization");

    console.log("🔑 Token check:", {
      cookie: authToken ? "Present" : "Missing",
      header: authHeader ? "Present" : "Missing",
    });

    const token = authHeader?.replace("Bearer ", "") || authToken;

    if (!token) {
      console.log("❌ No authentication token found");
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required. Please login again.",
        },
        { status: 401 },
      );
    }

    try {
      console.log("🔐 Verifying token...");
      const decoded = verifyToken(token) as JWTPayload;

      if (!decoded.userId) {
        console.log("❌ No userId in decoded token");
        return NextResponse.json(
          {
            success: false,
            message: "Invalid token structure",
          },
          { status: 401 },
        );
      }

      const userId = decoded.userId.toString();
      console.log("👤 User ID:", userId);

      console.log("📊 Connecting to database...");
      await connectToDatabase();
      console.log("✅ Database connected");

      const query: Record<string, unknown> = { userId };

      if (isValidId) {
        query._id = new mongoose.Types.ObjectId(id);
      } else if (isInvoice) {
        query.invoiceNumber = id;
      } else if (isOrder) {
        query.orderNumber = id;
      }

      const order = (await Order.findOne(query).lean()) as OrderDocument | null;

      // app/api/billing/[id]/route.ts
      // Update lines 250-265

      if (!order) {
        console.log("❌ Order not found for this user");

        if (isValidId) {
          const anyOrderResult = await Order.findById(id).lean();

          // Check if anyOrderResult is an array or a single document
          if (anyOrderResult) {
            // Handle both array and single document cases
            const anyOrder = Array.isArray(anyOrderResult)
              ? anyOrderResult[0]
              : anyOrderResult;

            if (anyOrder) {
              console.log("📋 Order exists but userId mismatch:", {
                orderUserId: anyOrder.userId?.toString(),
                currentUserId: userId,
              });
            }
          }
        }

        return NextResponse.json(
          {
            success: false,
            message:
              "Invoice not found or you do not have permission to view it.",
          },
          { status: 404 },
        );
      }

      // console.log("✅ Order found:", order.invoiceNumber);

      let customerDetails: CustomerDocument | null = null;
      if (order.customer?.customerId) {
        try {
          customerDetails = (await Customer.findById(order.customer.customerId)
            .select(
              "name phone email company address state city pincode gstin isInterState totalOrders totalSpent loyaltyPoints creditBalance createdAt",
            )
            .lean()) as CustomerDocument | null;
        } catch (custError) {
          console.error("Error fetching customer details:", custError);
        }
      }

      const productIds = [
        ...new Set(
          order.items.map((item: OrderItem) => item.productId?.toString()),
        ),
      ];
      const products = (await Product.find({
        _id: { $in: productIds },
      })
        .select("_id name sku pricing images")
        .lean()) as ProductDocument[];

      const productMap: Record<string, ProductDocument> = products.reduce(
        (map, product) => {
          map[product._id.toString()] = product;
          return map;
        },
        {} as Record<string, ProductDocument>,
      );

      const enhancedItems = order.items
        .filter((item: OrderItem) => item.productId) // Only process items with productId
        .map((item: OrderItem) => {
          const product = productMap[item.productId!.toString()]; // Now safe to use non-null assertion

          return {
            productId: item.productId,
            variationId: item.variationId,
            name: item.name,
            variationName: item.variationName,
            sku: item.sku || product?.sku,
            hsnCode: item.hsnCode || product?.pricing?.hsnCode || "",
            price: item.price,
            quantity: item.quantity,
            discount: item.discount || 0,
            taxableAmount: item.taxableAmount || 0,
            cgstRate: item.cgstRate || 0,
            sgstRate: item.sgstRate || 0,
            igstRate: item.igstRate || 0,
            cgstAmount: item.cgstAmount || 0,
            sgstAmount: item.sgstAmount || 0,
            igstAmount: item.igstAmount || 0,
            total: item.total || 0,
            stockDeducted: item.stockDeducted || false,
            stockDeductedAt: item.stockDeductedAt,
            productImage: product?.images?.[0]?.url || null,
          };
        });

      const formattedOrder = {
        _id: order._id.toString(),
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        orderDate: order.orderDate,
        invoiceDate: order.invoiceDate,
        dueDate: order.dueDate,
        customer: {
          customerId: order.customer?.customerId,
          name: order.customer?.name || "",
          phone: order.customer?.phone || "",
          email: order.customer?.email || "",
          gstin: order.customer?.gstin || "",
          address: order.customer?.address || "",
          state: order.customer?.state || "",
          isInterState: order.customer?.isInterState || false,
        },
        items: enhancedItems,
        subtotal: order.subtotal || 0,
        totalDiscount: order.totalDiscount || 0,
        totalTaxableAmount: order.totalTaxableAmount || 0,
        totalCgst: order.totalCgst || 0,
        totalSgst: order.totalSgst || 0,
        totalIgst: order.totalIgst || 0,
        roundOff: order.roundOff || 0,
        grandTotal: order.grandTotal || 0,
        amountPaid: order.amountPaid || 0,
        amountDue: order.amountDue || 0,
        payment: order.payment || {
          method: "cash",
          status: "pending",
          amount: 0,
        },
        status: order.status || "draft",
        paymentStatus: order.paymentStatus || "pending",
        fulfillmentStatus: order.fulfillmentStatus || "pending",
        inventoryStatus: order.inventoryStatus || { allDeducted: false },
        notes: order.notes || "",
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        isPaid: order.grandTotal <= (order.amountPaid || 0),
        isOverdue: order.paymentStatus === "overdue",
        balanceDue: (order.grandTotal || 0) - (order.amountPaid || 0),
        createdAtFormatted: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN")
          : null,
        updatedAtFormatted: order.updatedAt
          ? new Date(order.updatedAt).toLocaleDateString("en-IN")
          : null,
        invoiceDateFormatted: order.invoiceDate
          ? new Date(order.invoiceDate).toLocaleDateString("en-IN")
          : null,
        dueDateFormatted: order.dueDate
          ? new Date(order.dueDate).toLocaleDateString("en-IN")
          : null,
        paymentSummary: {
          method: order.payment?.method,
          status: order.paymentStatus,
          transactionId: order.payment?.transactionId,
          paidAt: order.payment?.paidAt,
          paidAtFormatted: order.payment?.paidAt
            ? new Date(order.payment.paidAt).toLocaleDateString("en-IN")
            : null,
          amountPaid: order.amountPaid || 0,
          amountDue: order.amountDue || 0,
        },
        customerDetails: customerDetails
          ? {
              _id: customerDetails._id.toString(),
              name: customerDetails.name,
              phone: customerDetails.phone,
              email: customerDetails.email,
              company: customerDetails.company,
              address: customerDetails.address,
              state: customerDetails.state,
              city: customerDetails.city,
              pincode: customerDetails.pincode,
              gstin: customerDetails.gstin,
              isInterState: customerDetails.isInterState,
              totalOrders: customerDetails.totalOrders,
              totalSpent: customerDetails.totalSpent,
              loyaltyPoints: customerDetails.loyaltyPoints,
              creditBalance: customerDetails.creditBalance,
              createdAt: customerDetails.createdAt,
            }
          : null,
      };

      return NextResponse.json({
        success: true,
        order: formattedOrder,
        message: "Order fetched successfully",
      });
    } catch (authError) {
      const err = authError as Error;
      console.error("❌ Authentication error:", err.message);

      if (err.message.includes("Token expired")) {
        return NextResponse.json(
          {
            success: false,
            message: "Your session has expired. Please login again.",
          },
          { status: 401 },
        );
      } else if (err.message.includes("Invalid token")) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid authentication. Please login again.",
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed: " + err.message,
        },
        { status: 401 },
      );
    }
  } catch (error) {
    const err = error as Error;
    console.error("❌ Get order error:", err.message);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + err.message,
      },
      { status: 500 },
    );
  }
}

// ─── PUT /api/billing/[id] - Update order ─────────────────────────────────────

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const id = params.id;

    console.log("🔄 PUT /api/billing/[id] - Updating order:", id);

    const authToken = request.cookies.get("auth_token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || authToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token) as JWTPayload;
    const userId = decoded.userId?.toString();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const body: UpdateBody = await request.json();
    const {
      paymentStatus,
      fulfillmentStatus,
      status,
      notes,
      amountPaid,
      paymentMethod,
      transactionId,
    } = body;

    const order = (await Order.findOne({
      _id: id,
      userId: userId,
    })) as OrderDocument | null;

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
    if (status) order.status = status;
    if (notes) order.notes = notes;

    if (paymentMethod && order.payment) {
      order.payment.method = paymentMethod;
    }

    if (transactionId && order.payment) {
      order.payment.transactionId = transactionId;
    }

    if (amountPaid !== undefined) {
      order.amountPaid = amountPaid;
      order.amountDue = order.grandTotal - amountPaid;

      if (order.amountPaid >= order.grandTotal) {
        order.paymentStatus = "paid";
        order.payment.status = "completed";
        if (!order.payment.paidAt) {
          order.payment.paidAt = new Date();
        }
      } else if (order.amountPaid > 0) {
        order.paymentStatus = "partial";
        order.payment.status = "processing";
      } else {
        order.paymentStatus = "pending";
        order.payment.status = "pending";
      }
    }

    order.updatedBy = userId;
    order.updatedAt = new Date();

    await order.save();

    console.log("✅ Order updated successfully:", order._id);

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        amountPaid: order.amountPaid,
        amountDue: order.amountDue,
      },
    });
  } catch (error) {
    const err = error as ValidationError & Error;
    console.error("❌ Update order error:", err);

    if (err.name === "ValidationError" && err.errors) {
      const errors = Object.values(err.errors).map(
        (e: { message: string }) => e.message,
      );
      return NextResponse.json(
        {
          success: false,
          message: errors.join(", "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ─── PATCH /api/billing/[id] - Quick update ───────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const id = params.id;

    console.log("🔧 PATCH /api/billing/[id] - Quick update:", id);

    const authToken = request.cookies.get("auth_token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || authToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token) as JWTPayload;
    const userId = decoded.userId?.toString();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { action } = body;

    const order = (await Order.findOne({
      _id: id,
      userId: userId,
    })) as OrderDocument | null;

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    switch (action) {
      case "mark-paid":
        order.paymentStatus = "paid";
        order.payment.status = "completed";
        order.payment.paidAt = new Date();
        order.amountPaid = order.grandTotal;
        order.amountDue = 0;
        break;

      case "mark-delivered":
        order.fulfillmentStatus = "delivered";
        order.status = "completed";
        order.completedAt = new Date();
        break;

      case "mark-cancelled":
        order.status = "cancelled";
        order.cancelledAt = new Date();
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action",
          },
          { status: 400 },
        );
    }

    order.updatedBy = userId;
    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json({
      success: true,
      message: `Order ${action.replace("-", " ")} successfully`,
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Patch order error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ─── DELETE /api/billing/[id] - Delete/Cancel order ───────────────────────────

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const id = params.id;

    console.log("🗑️ DELETE /api/billing/[id] - Deleting order:", id);

    const authToken = request.cookies.get("auth_token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || authToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token) as JWTPayload;
    const userId = decoded.userId?.toString();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const body: DeleteBody = await request.json();
    const { permanent = false } = body;

    if (permanent) {
      const result = await Order.deleteOne({
        _id: id,
        userId: userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Order not found",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Order permanently deleted",
      });
    } else {
      const order = (await Order.findOne({
        _id: id,
        userId: userId,
      })) as OrderDocument | null;

      if (!order) {
        return NextResponse.json(
          {
            success: false,
            message: "Order not found",
          },
          { status: 404 },
        );
      }

      order.status = "cancelled";
      order.cancelledAt = new Date();
      order.updatedBy = userId;
      order.updatedAt = new Date();

      await order.save();

      return NextResponse.json({
        success: true,
        message: "Order cancelled successfully",
        order: {
          id: order._id,
          status: order.status,
        },
      });
    }
  } catch (error) {
    const err = error as Error;
    console.error("❌ Delete order error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
