// app/api/products/categories/[id]/route.ts
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

// GET /api/products/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 GET /api/products/categories/${params.id} - Fetching category...`);

    const userId = getUserId(request);
    await connectToDatabase();

    const category = await Category.findOne({
      _id: params.id,
      userId,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Get product count
    const productCount = await Product.countDocuments({
      userId,
      category: category.name,
    });

    const categoryWithStats = {
      ...category.toObject(),
      productCount,
    };

    return NextResponse.json({
      success: true,
      category: categoryWithStats,
    });
  } catch (error: any) {
    console.error(`❌ GET /api/products/categories/${params.id} error:`, error);

    if (error.message === "Authentication required" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch category",
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`📝 PUT /api/products/categories/${params.id} - Updating category...`);

    const userId = getUserId(request);
    await connectToDatabase();

    const body = await request.json();
    const { name, description, parentCategory, icon, color, isActive } = body;

    // Find category
    const category = await Category.findOne({
      _id: params.id,
      userId,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if new name already exists (if name is being changed)
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        userId,
        name: name.trim(),
        _id: { $ne: params.id },
      });

      if (existingCategory) {
        return NextResponse.json(
          { success: false, message: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Store old name for updating products
    const oldName = category.name;

    // Update category
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (parentCategory !== undefined) updateData.parentCategory = parentCategory;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    // If name changed, update all products with this category
    if (name && name.trim() !== oldName) {
      await Product.updateMany(
        { userId, category: oldName },
        { $set: { category: name.trim() } }
      );
    }

    // Handle parent category changes
    if (parentCategory !== category.parentCategory) {
      // Remove from old parent's subcategories
      if (category.parentCategory) {
        await Category.findByIdAndUpdate(category.parentCategory, {
          $pull: { subCategories: category._id },
        });
      }

      // Add to new parent's subcategories
      if (parentCategory) {
        await Category.findByIdAndUpdate(parentCategory, {
          $addToSet: { subCategories: category._id },
        });
      }
    }

    console.log("✅ Category updated:", params.id);

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    console.error(`❌ PUT /api/products/categories/${params.id} error:`, error);

    if (error.message === "Authentication required" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update category",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🗑️ DELETE /api/products/categories/${params.id} - Deleting category...`);

    const userId = getUserId(request);
    await connectToDatabase();

    const category = await Category.findOne({
      _id: params.id,
      userId,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
      userId,
      category: category.name,
    });

    if (productCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete category. It has ${productCount} product(s). Please reassign or delete products first.` 
        },
        { status: 400 }
      );
    }

    // Remove from parent's subcategories
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subCategories: category._id },
      });
    }

    // Delete category
    await Category.findByIdAndDelete(params.id);

    console.log("✅ Category deleted:", params.id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error(`❌ DELETE /api/products/categories/${params.id} error:`, error);

    if (error.message === "Authentication required" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete category",
      },
      { status: 500 }
    );
  }
}