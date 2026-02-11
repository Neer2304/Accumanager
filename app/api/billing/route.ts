// app/api/billing/route.ts - UPDATED WITH INVENTORY DEDUCTION
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import { verifyToken } from "@/lib/jwt";
import { PaymentService } from "@/services/paymentService";

export async function POST(request: NextRequest) {
  try {
    console.log("💰 POST /api/billing - Starting...");

    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      console.log("❌ No auth token in billing request");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      const userId = decoded.userId?.toString();

      // Check subscription before processing billing
      const subscription = await PaymentService.checkSubscription(userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          {
            message:
              "Your subscription has expired. Please renew to create bills.",
          },
          { status: 403 },
        );
      }

      // Check invoice usage limit
      const limitCheck = await PaymentService.checkUsageLimit(
        userId,
        "invoices",
        1,
      );
      if (!limitCheck.canProceed) {
        return NextResponse.json(
          {
            message: `You've reached your invoice limit (${limitCheck.currentUsage}/${limitCheck.limit}). Please upgrade your plan.`,
          },
          { status: 403 },
        );
      }

      console.log("👤 Creating bill for user:", userId);

      await connectToDatabase();
      console.log("✅ Database connected for billing");

      const body = await request.json();
      const { items, customer, invoiceDetails, paymentMethod, notes } = body;

      console.log("📦 Billing data:", {
        itemsCount: items?.length,
        customer: customer?.name,
        paymentMethod,
      });

      if (
        !items ||
        !items.length ||
        !customer ||
        !customer.name ||
        !customer.phone
      ) {
        return NextResponse.json(
          {
            message:
              "Missing required fields: items, customer name, and phone are required",
          },
          { status: 400 },
        );
      }

      // AUTO-CUSTOMER CREATION LOGIC
      let customerRecord = null;

      // Check if customer already exists by phone number
      customerRecord = await Customer.findOne({
        phone: customer.phone,
        userId: userId,
      });

      if (!customerRecord) {
        console.log("👥 Creating new customer automatically...");

        // Check customer limit before creating
        const customerLimitCheck = await PaymentService.checkUsageLimit(
          userId,
          "customers",
          1,
        );
        if (!customerLimitCheck.canProceed) {
          return NextResponse.json(
            {
              message: `Customer limit reached (${customerLimitCheck.currentUsage}/${customerLimitCheck.limit}). Cannot create new customer.`,
            },
            { status: 403 },
          );
        }

        // Create new customer from billing data
        customerRecord = new Customer({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || "",
          company: customer.company || "",
          address: customer.address || "",
          state: customer.state || "",
          city: customer.city || "",
          pincode: customer.pincode || "",
          gstin: customer.gstin || "",
          isInterState: customer.isInterState || false,
          userId: userId,
          totalOrders: 1,
          totalSpent: 0,
        });

        await customerRecord.save();

        // Update customer usage
        await PaymentService.updateUsage(userId, "customers", 1);
        console.log("✅ New customer created:", customerRecord._id);
      } else {
        console.log("👥 Existing customer found:", customerRecord._id);

        // Update customer details if new information is provided
        const updates: any = {};
        if (customer.email && !customerRecord.email)
          updates.email = customer.email;
        if (customer.company && !customerRecord.company)
          updates.company = customer.company;
        if (customer.address && !customerRecord.address)
          updates.address = customer.address;
        if (customer.state && !customerRecord.state)
          updates.state = customer.state;
        if (customer.city && !customerRecord.city) updates.city = customer.city;
        if (customer.pincode && !customerRecord.pincode)
          updates.pincode = customer.pincode;
        if (customer.gstin && !customerRecord.gstin)
          updates.gstin = customer.gstin;

        // Increment order count
        updates.totalOrders = (customerRecord.totalOrders || 0) + 1;

        if (Object.keys(updates).length > 0) {
          await Customer.findByIdAndUpdate(customerRecord._id, updates);
          console.log("✅ Customer details updated");
        }
      }

      // Generate invoice number
      const invoiceNumber =
        invoiceDetails?.invoiceNumber ||
        `INV-${Date.now().toString().slice(-6)}`;

      // Process items and calculate totals
      const processedItems = [];
      let subtotal = 0;
      let totalDiscount = 0;
      let totalTaxableAmount = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;

      // Store items for inventory deduction
      const itemsForInventoryDeduction = [];

      for (const item of items) {
        // Find product with user ID to ensure it belongs to the user
        const product = await Product.findOne({
          _id: item.productId,
          userId: userId,
        });

        if (!product) {
          return NextResponse.json(
            { message: `Product not found: ${item.name}` },
            { status: 400 },
          );
        }

        // Check stock BEFORE processing
        let availableStock = 0;
        if (item.variationId) {
          const variation = product.variations.find(
            (v: any) => v._id.toString() === item.variationId,
          );
          availableStock = variation?.stock || 0;
        } else {
          availableStock =
            product.variations.reduce(
              (sum: number, v: any) => sum + v.stock,
              0,
            ) +
            product.batches.reduce(
              (sum: number, b: any) => sum + b.quantity,
              0,
            );
        }

        if (availableStock < item.quantity) {
          return NextResponse.json(
            {
              message: `Insufficient stock for ${item.name}. Available: ${availableStock}`,
            },
            { status: 400 },
          );
        }

        // Add to inventory deduction list
        itemsForInventoryDeduction.push({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
          productName: item.name,
        });

        // Calculate amounts
        const itemTotal = item.price * item.quantity;
        const discountAmount = (itemTotal * (item.discount || 0)) / 100;
        const taxableAmount = itemTotal - discountAmount;

        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        if (customer.isInterState) {
          igstAmount =
            (taxableAmount * (product.gstDetails.igstRate || 0)) / 100;
        } else {
          cgstAmount =
            (taxableAmount * (product.gstDetails.cgstRate || 0)) / 100;
          sgstAmount =
            (taxableAmount * (product.gstDetails.sgstRate || 0)) / 100;
        }

        const itemNetTotal =
          taxableAmount + cgstAmount + sgstAmount + igstAmount;

        processedItems.push({
          productId: item.productId,
          variationId: item.variationId,
          name: item.name,
          variationName: item.variationName,
          hsnCode: product.gstDetails.hsnCode,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
          taxableAmount,
          cgstRate: product.gstDetails.cgstRate,
          sgstRate: product.gstDetails.sgstRate,
          igstRate: product.gstDetails.igstRate,
          cgstAmount,
          sgstAmount,
          igstAmount,
          total: itemNetTotal,
          stockDeducted: false, // Will be updated after successful deduction
        });

        subtotal += itemTotal;
        totalDiscount += discountAmount;
        totalTaxableAmount += taxableAmount;
        totalCgst += cgstAmount;
        totalSgst += sgstAmount;
        totalIgst += igstAmount;
      }

      const grandTotal = totalTaxableAmount + totalCgst + totalSgst + totalIgst;

      // Create order
      const order = new Order({
        invoiceNumber,
        invoiceDate: invoiceDetails?.date
          ? new Date(invoiceDetails.date)
          : new Date(),
        customer: {
          ...customer,
          customerId: customerRecord._id.toString(), // 👈 ALWAYS store as string for consistency
          name: customer.name,
          phone: customer.phone,
          email: customer.email || "",
          address: customer.address || "",
          gstin: customer.gstin || "",
          state: customer.state || "",
          isInterState: customer.isInterState || false,
        },
        items: processedItems,
        subtotal,
        totalDiscount,
        totalTaxableAmount,
        totalCgst,
        totalSgst,
        totalIgst,
        grandTotal,
        paymentMethod: paymentMethod || "cash",
        paymentStatus: "pending",
        status: "draft",
        notes,
        userId: userId,
      });

      console.log("💾 Saving order to database...");
      await order.save();

      // INVENTORY DEDUCTION - DEDUCT STOCK FROM PRODUCTS
      console.log("📦 Deducting inventory from products...");
      for (const item of itemsForInventoryDeduction) {
        const product = await Product.findOne({
          _id: item.productId,
          userId: userId,
        });

        if (!product) continue;

        if (item.variationId) {
          // Deduct from specific variation
          const variationIndex = product.variations.findIndex(
            (v: any) => v._id.toString() === item.variationId,
          );

          if (variationIndex !== -1) {
            const variation = product.variations[variationIndex];
            if (variation.stock >= item.quantity) {
              variation.stock -= item.quantity;

              // Mark item as stock deducted
              const orderItemIndex = order.items.findIndex(
                (oi: any) =>
                  oi.productId === item.productId &&
                  oi.variationId === item.variationId,
              );
              if (orderItemIndex !== -1) {
                order.items[orderItemIndex].stockDeducted = true;
              }

              console.log(
                `✅ Deducted ${item.quantity} from ${item.productName} variation`,
              );
            } else {
              console.error(
                `❌ Insufficient stock for variation: ${item.productName}`,
              );
              throw new Error(
                `Insufficient stock for ${item.productName} variation`,
              );
            }
          }
        } else {
          // Deduct from base product (use batches first, then variations)
          let remainingQty = item.quantity;

          // Try to deduct from batches (FIFO)
          for (const batch of product.batches) {
            if (batch.quantity >= remainingQty) {
              batch.quantity -= remainingQty;
              remainingQty = 0;
              break;
            } else {
              remainingQty -= batch.quantity;
              batch.quantity = 0;
            }
          }

          // If still remaining, deduct from variations
          if (remainingQty > 0) {
            for (const variation of product.variations) {
              if (variation.stock >= remainingQty) {
                variation.stock -= remainingQty;
                remainingQty = 0;
                break;
              } else {
                remainingQty -= variation.stock;
                variation.stock = 0;
              }
            }
          }

          if (remainingQty > 0) {
            throw new Error(`Insufficient stock for ${item.productName}`);
          }

          // Mark all items for this product as stock deducted
          order.items.forEach((oi: any) => {
            if (oi.productId === item.productId && !oi.variationId) {
              oi.stockDeducted = true;
            }
          });

          console.log(`✅ Deducted ${item.quantity} from ${item.productName}`);
        }

        // Save the updated product
        await product.save();
      }

      // Update order with stock deduction status
      await order.save();

      // Update customer's total spent and last order date
      await Customer.findByIdAndUpdate(customerRecord._id, {
        lastOrderDate: new Date(),
        $inc: { totalSpent: grandTotal },
      });

      // Update invoice usage
      await PaymentService.updateUsage(userId, "invoices", 1);

      console.log(
        "✅ Order saved and inventory deducted successfully:",
        order._id,
      );

      return NextResponse.json(
        {
          success: true,
          order: {
            id: order._id,
            invoiceNumber: order.invoiceNumber,
            grandTotal: order.grandTotal,
            status: order.status,
            customerId: customerRecord._id,
            items: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              stockDeducted: item.stockDeducted,
            })),
          },
          message: "Invoice created and inventory updated successfully",
        },
        { status: 201 },
      );
    } catch (authError) {
      console.error("❌ Auth error in billing:", authError);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("❌ Create bill error:", error);

    if (
      error.message.includes("subscription") ||
      error.message.includes("limit")
    ) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }

    if (error.message.includes("Insufficient stock")) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// API for reversing inventory deduction (for returns/cancellations)
export async function PATCH(request: NextRequest) {
  try {
    console.log("🔄 PATCH /api/billing - Reversing inventory...");

    const authToken = request.cookies.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      const userId = decoded.userId;

      await connectToDatabase();

      const body = await request.json();
      const { orderId, items } = body;

      if (!orderId || !items || !items.length) {
        return NextResponse.json(
          { message: "Order ID and items are required" },
          { status: 400 },
        );
      }

      // Find the order
      const order = await Order.findOne({
        _id: orderId,
        userId: userId,
      });

      if (!order) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 },
        );
      }

      // Restock inventory for each item
      for (const item of items) {
        const product = await Product.findOne({
          _id: item.productId,
          userId: userId,
        });

        if (!product) continue;

        if (item.variationId) {
          // Restock to specific variation
          const variationIndex = product.variations.findIndex(
            (v: any) => v._id.toString() === item.variationId,
          );

          if (variationIndex !== -1) {
            product.variations[variationIndex].stock += item.quantity;
            console.log(
              `✅ Restocked ${item.quantity} to ${product.name} variation`,
            );
          }
        } else {
          // Restock to first variation
          if (product.variations.length > 0) {
            product.variations[0].stock += item.quantity;
            console.log(`✅ Restocked ${item.quantity} to ${product.name}`);
          } else {
            // Create a new batch for the return
            product.batches.push({
              batchNumber: `RET-${Date.now()}`,
              quantity: item.quantity,
              costPrice: product.baseCostPrice,
              sellingPrice: product.basePrice,
              mfgDate: new Date(),
              expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              receivedDate: new Date(),
            });
            console.log(`✅ Created return batch for ${product.name}`);
          }
        }

        await product.save();
      }

      // Update order status to cancelled/returned
      order.status = "returned";
      order.updatedAt = new Date();
      await order.save();

      console.log("✅ Inventory restocked successfully for order:", orderId);

      return NextResponse.json({
        success: true,
        message: "Inventory restocked and order updated",
        order: {
          id: order._id,
          status: order.status,
          updatedAt: order.updatedAt,
        },
      });
    } catch (authError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("❌ Reverse inventory error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
