// app/api/products/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";

// Helper function to verify auth
const getUserId = (request: NextRequest) => {
  const authToken = request.cookies.get("auth_token")?.value;
  if (!authToken) throw new Error("Authentication required");
  
  const decoded = verifyToken(authToken);
  if (!decoded.userId) throw new Error("Invalid token");
  
  return decoded.userId.toString();
};

// GET /api/products/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/products/categories - Fetching categories...");

    const userId = getUserId(request);
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get("includeProducts") === "true";

    // Fetch categories
    const categories = await Category.find({ userId }).sort({ name: 1 });

    // If requested, include product counts
    if (includeProducts) {
      const products = await Product.find({ userId });
      
      const categoriesWithCounts = categories.map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category.name
        );
        
        const totalRevenue = categoryProducts.reduce(
          (sum, product) => sum + (product.basePrice || 0),
          0
        );

        return {
          ...category.toObject(),
          productCount: categoryProducts.length,
          totalRevenue,
        };
      });

      return NextResponse.json({
        success: true,
        categories: categoriesWithCounts,
      });
    }

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error("❌ GET /api/products/categories error:", error);

    if (error.message === "Authentication required" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch categories",
        categories: [],
      },
      { status: 500 }
    );
  }
}

// POST /api/products/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    console.log("📝 POST /api/products/categories - Creating category...");

    const userId = getUserId(request);
    await connectToDatabase();

    const body = await request.json();
    const { name, description, parentCategory, icon, color } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      userId,
      name: name.trim(),
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Create category
    const category = new Category({
      userId,
      name: name.trim(),
      description: description?.trim() || "",
      parentCategory: parentCategory || null,
      icon: icon || "category",
      color: color || "#2563eb",
      isActive: true,
    });

    await category.save();

    // If this is a subcategory, update parent category
    if (parentCategory) {
      await Category.findByIdAndUpdate(parentCategory, {
        $addToSet: { subCategories: category._id },
      });
    }

    console.log("✅ Category created:", category._id);

    return NextResponse.json({
      success: true,
      category,
      message: "Category created successfully",
    });
  } catch (error: any) {
    console.error("❌ POST /api/products/categories error:", error);

    if (error.message === "Authentication required" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create category",
      },
      { status: 500 }
    );
  }
}