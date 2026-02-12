import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Company from "@/models/Company";
import UserCompany from "@/models/UserCompany";
import { NotificationService } from "@/services/notificationService";

// ✅ GET ALL COMPANIES FOR USER
export async function GET(request: NextRequest) {
  try {
    console.log("🔄 GET /api/companies - Starting...");

    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');

      // Get user's active company associations
      const userCompanies = await UserCompany.find({
        userId: decoded.userId,
        status: "active",
      })
        .populate("companyId")
        .lean();

      // Extract companies and filter out inactive ones
      const companies = userCompanies
        .map((uc) => uc.companyId)
        .filter((company) => company && company.isActive === true);

      return NextResponse.json({
        success: true,
        companies,
        count: companies.length,
        pagination: {
          page,
          limit,
          total: companies.length,
          pages: Math.ceil(companies.length / limit)
        },
      });
      
    } catch (authError) {
      console.error("❌ Auth error:", authError);
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Get companies error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// ✅ CREATE COMPANY - WITH 5 COMPANY LIMIT
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 POST /api/companies - Starting...");

    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // 🔴 CHECK COMPANY LIMIT - MAX 5 ACTIVE COMPANIES
      const activeCompaniesCount = await UserCompany.countDocuments({
        userId: decoded.userId,
        status: 'active'
      });

      if (activeCompaniesCount >= 5) {
        return NextResponse.json(
          { 
            success: false, 
            error: "You have reached the maximum limit of 5 active companies. Please delete or deactivate an existing company before creating a new one.",
            limit: 5,
            current: activeCompaniesCount
          },
          { status: 400 },
        );
      }

      const companyData = await request.json();

      // Validate required fields
      if (!companyData.name || !companyData.email) {
        return NextResponse.json(
          { success: false, error: "Company name and email are required" },
          { status: 400 },
        );
      }

      // Check if company email already exists
      const existingCompany = await Company.findOne({
        email: companyData.email,
      });
      
      if (existingCompany) {
        return NextResponse.json(
          { success: false, error: "Company with this email already exists" },
          { status: 409 },
        );
      }

      // Create company
      const company = new Company({
        ...companyData,
        createdBy: decoded.userId,
        isActive: true,
        subscription: {
          ...companyData.subscription,
          usedSeats: 1 // Creator uses 1 seat
        }
      });

      await company.save();

      // Create user-company association as admin
      const userCompany = new UserCompany({
        userId: decoded.userId,
        companyId: company._id,
        role: "admin",
        status: "active",
        joinedAt: new Date(),
        isDefault: activeCompaniesCount === 0, // First company is default
        invitedBy: decoded.userId,
        invitedByName: decoded.name || "System",
      });

      await userCompany.save();

      // Update company usedSeats
      await Company.findByIdAndUpdate(company._id, {
        'subscription.usedSeats': 1
      });

      // Create notification
      try {
        await NotificationService.notifyCompanyCreated(company, decoded.userId);
      } catch (notifError) {
        console.error("⚠️ Failed to create notification:", notifError);
      }

      console.log("✅ Company created:", company._id);
      return NextResponse.json({ 
        success: true, 
        company,
        message: "Company created successfully",
        remainingSlots: 5 - (activeCompaniesCount + 1)
      }, { status: 201 });
      
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Create company error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// ✅ UPDATE COMPANY
export async function PUT(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const updateData = await request.json();
      const { companyId, ...updateFields } = updateData;

      if (!companyId) {
        return NextResponse.json(
          { success: false, error: "Company ID is required" },
          { status: 400 },
        );
      }

      // Check if user is admin of this company
      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: "admin",
        status: "active",
      });

      if (!userCompany) {
        return NextResponse.json(
          {
            success: false,
            error: "You do not have permission to update this company",
          },
          { status: 403 },
        );
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { ...updateFields, updatedAt: new Date() },
        { new: true, runValidators: true },
      );

      if (!updatedCompany) {
        return NextResponse.json(
          { success: false, error: "Company not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ 
        success: true, 
        company: updatedCompany,
        message: "Company updated successfully" 
      });
      
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Update company error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// ✅ DELETE COMPANY (Soft Delete)
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      const { searchParams } = new URL(request.url);
      const companyId = searchParams.get("id");

      if (!companyId) {
        return NextResponse.json(
          { success: false, error: "Company ID is required" },
          { status: 400 },
        );
      }

      // Check if user is admin of this company
      const userCompany = await UserCompany.findOne({
        userId: decoded.userId,
        companyId,
        role: "admin",
        status: "active",
      });

      if (!userCompany) {
        return NextResponse.json(
          {
            success: false,
            error: "You do not have permission to delete this company",
          },
          { status: 403 },
        );
      }

      // Check if this is the user's only company
      const activeCompaniesCount = await UserCompany.countDocuments({
        userId: decoded.userId,
        status: 'active'
      });

      // Soft delete - deactivate company
      await Company.findByIdAndUpdate(companyId, {
        isActive: false,
        "subscription.status": "cancelled",
      });

      // Deactivate all user associations
      await UserCompany.updateMany(
        { companyId },
        { status: "inactive" }
      );

      // If this was default company, set another as default
      if (userCompany.isDefault && activeCompaniesCount > 1) {
        const anotherCompany = await UserCompany.findOne({
          userId: decoded.userId,
          companyId: { $ne: companyId },
          status: 'active'
        });
        
        if (anotherCompany) {
          anotherCompany.isDefault = true;
          await anotherCompany.save();
        }
      }

      return NextResponse.json({
        success: true,
        message: "Company deactivated successfully",
        remainingCompanies: activeCompaniesCount - 1
      });
      
    } catch (authError) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Delete company error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}