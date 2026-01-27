// app/api/projects/route.ts - COMPLETE VERSION
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/jwt";
import { PaymentService } from "@/services/paymentService";
import { NotificationService } from "@/services/notificationService";

// ✅ GET ALL PROJECTS
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/projects - Starting...");

    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      console.log("⚠️ No auth token found");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      console.log("👤 User:", decoded.userId);

      // Check subscription status
      const subscription = await PaymentService.checkSubscription(
        decoded.userId,
      );
      if (!subscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Project management requires an active subscription. Please upgrade your plan.",
          },
          { status: 402 },
        );
      }

      await connectToDatabase();
      console.log("✅ Database connected");

      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const category = searchParams.get("category");

      let query: any = { userId: decoded.userId };

      if (status && status !== "all") {
        query.status = status;
      }

      if (category && category !== "all") {
        query.category = category;
      }

      const projects = await Project.find(query).sort({ updatedAt: -1 }).lean();

      console.log(
        `✅ Found ${projects.length} projects for user ${decoded.userId}`,
      );

      return NextResponse.json({
        success: true,
        projects: projects,
      });
    } catch (authError) {
      console.error("❌ Auth error:", authError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Get projects error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ✅ CREATE NEW PROJECT
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 POST /api/projects - Starting...");

    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);

      // Check subscription status and limits
      const subscription = await PaymentService.checkSubscription(
        decoded.userId,
      );
      if (!subscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Project creation requires an active subscription. Please upgrade your plan.",
          },
          { status: 402 },
        );
      }

      // Check project limits
      await connectToDatabase();
      const userProjectCount = await Project.countDocuments({
        userId: decoded.userId,
      });

      if (
        subscription.limits?.projects &&
        userProjectCount >= subscription.limits.projects
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Project limit reached! You can only create ${subscription.limits.projects} projects on your current plan. Upgrade to create more projects.`,
          },
          { status: 402 },
        );
      }

      const projectData = await request.json();

      // Validate required fields
      if (
        !projectData.name ||
        !projectData.description ||
        !projectData.startDate ||
        !projectData.deadline
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Name, description, start date, and deadline are required",
          },
          { status: 400 },
        );
      }

      const project = new Project({
        ...projectData,
        userId: decoded.userId,
        progress: 0,
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        blockedTasks: 0,
      });

      await project.save();
      console.log("✅ Project created:", project._id);

      // Create notification for the project creator
      try {
        await NotificationService.notifyProjectCreated(project, decoded.userId);
        console.log("✅ Project notification created successfully");
      } catch (notifError) {
        console.error(
          "⚠️ Failed to create notification (project still saved):",
          notifError,
        );
      }

      return NextResponse.json(
        {
          success: true,
          project: project,
        },
        { status: 201 },
      );
    } catch (authError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Create project error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("📝 PUT /api/projects - Updating project...");

    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      const { projectId, ...updateData } = await request.json();

      if (!projectId) {
        return NextResponse.json(
          {
            success: false,
            error: "Project ID is required",
          },
          { status: 400 },
        );
      }

      await connectToDatabase();

      // Get the old project data to compare status
      const oldProject = await Project.findById(projectId);

      const project = await Project.findOneAndUpdate(
        { _id: projectId, userId: decoded.userId },
        updateData,
        { new: true },
      );

      if (!project) {
        return NextResponse.json(
          {
            success: false,
            error: "Project not found",
          },
          { status: 404 },
        );
      }

      console.log("✅ Project updated:", projectId);

      // Create notification for project update if status changed to completed
      if (
        updateData.status === "completed" &&
        oldProject?.status !== "completed"
      ) {
        try {
          await NotificationService.notifyProjectCompleted(
            project,
            decoded.userId,
          );
          console.log("✅ Project completion notification created");
        } catch (notifError) {
          console.error(
            "⚠️ Failed to create completion notification:",
            notifError,
          );
        }
      }

      return NextResponse.json({
        success: true,
        project: project,
      });
    } catch (authError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Update project error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ✅ DELETE PROJECT
export async function DELETE(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    try {
      const decoded = verifyToken(authToken);
      const { searchParams } = new URL(request.url);
      const projectId = searchParams.get("id");

      if (!projectId) {
        return NextResponse.json(
          {
            success: false,
            error: "Project ID is required",
          },
          { status: 400 },
        );
      }

      await connectToDatabase();

      const result = await Project.deleteOne({
        _id: projectId,
        userId: decoded.userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Project not found",
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (authError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 },
      );
    }
  } catch (error: any) {
    console.error("❌ Delete project error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
