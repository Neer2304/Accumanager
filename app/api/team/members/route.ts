import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";
import TeamProject from "@/models/TeamProject";
import TeamTask from "@/models/TeamTask";
import { verifyToken } from "@/lib/jwt";
import { PaymentService } from "@/services/paymentService";
import { NotificationService } from "@/services/notificationService";
import { TeamActivityHooks } from "@/hooks/teamActivityHooks";
import type {
  TeamMemberInput,
  TeamMembersResponse,
} from "@/types/team";

// GET - Get all team members with team projects and tasks
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check subscription
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          {
            error: "Please upgrade your subscription to access team management",
          },
          { status: 402 }
        );
      }

      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const department = searchParams.get("department") || "";
      const role = searchParams.get("role") || "";
      const status = searchParams.get("status") || "";
      const sortBy = searchParams.get("sortBy") || "name";
      const sortOrder = searchParams.get("sortOrder") || "asc";
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");

      // Build filter
      const filter: any = { userId: decoded.userId };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
        ];
      }

      if (department) {
        filter.department = department;
      }

      if (role) {
        filter.role = role;
      }

      if (status && status !== "all") {
        filter.status = status;
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Get total count
      const total = await TeamMember.countDocuments(filter);

      // Get team members with pagination
      const teamMembers = await TeamMember.find(filter)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Get team projects and tasks for each team member
      const teamMembersWithDetails = await Promise.all(
        teamMembers.map(async (member) => {
          // Get team projects
          const teamProjects = await TeamProject.find({
            _id: { $in: member.teamProjects || [] },
          })
            .select("name status progress category startDate deadline")
            .lean();

          // Get team tasks
          const teamTasks = await TeamTask.find({
            _id: { $in: member.teamTasks || [] },
          })
            .select("title status priority dueDate estimatedHours actualHours")
            .lean();

          // Count active projects and tasks
          const activeTeamProjects = teamProjects.filter(
            (p) => p.status === 'active' || p.status === 'planning'
          ).length;

          const activeTeamTasks = teamTasks.filter(
            (t) => t.status === 'todo' || t.status === 'in_progress'
          ).length;

          return {
            ...member,
            teamProjects,
            teamTasks,
            teamProjectsCount: teamProjects.length,
            teamTasksCount: teamTasks.length,
            activeTeamProjects,
            activeTeamTasks,
            performance: member.performance || 0,
            tasksCompleted: member.tasksCompleted || 0,
          };
        })
      );

      const response: TeamMembersResponse = {
        success: true,
        data: {
          teamMembers: teamMembersWithDetails,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
          statistics: {
            total: teamMembers.length,
            active: teamMembers.filter((m) => m.status === "active").length,
            away: teamMembers.filter((m) => m.status === "away").length,
            offline: teamMembers.filter((m) => m.status === "offline").length,
            // on_leave: teamMembers.filter((m) => m.status === "on_leave").length,
          },
        },
      };

      return NextResponse.json(response);
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Get team members error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    try {
      const decoded = verifyToken(authToken);
      await connectToDatabase();

      // Check subscription
      const subscription = await PaymentService.checkSubscription(decoded.userId);
      if (!subscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "Please upgrade your subscription to add team members",
          },
          { status: 402 }
        );
      }

      // Check team member count against limit
      const memberCount = await TeamMember.countDocuments({
        userId: decoded.userId,
      });
      if (memberCount >= subscription.limits.teamMembers) {
        return NextResponse.json(
          {
            success: false,
            error: `Team member limit reached (${subscription.limits.teamMembers}). Please upgrade your plan.`,
            limitReached: true,
          },
          { status: 402 }
        );
      }

      const body: TeamMemberInput = await request.json();

      // Validate required fields
      if (!body.name || !body.email || !body.role) {
        return NextResponse.json(
          {
            success: false,
            error: "Name, email, and role are required",
          },
          { status: 400 }
        );
      }

      // Validate email
      if (!/\S+@\S+\.\S+/.test(body.email)) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter a valid email address",
          },
          { status: 400 }
        );
      }

      // Check if team member with same email already exists
      const existingMember = await TeamMember.findOne({
        email: body.email.toLowerCase(),
        userId: decoded.userId,
      });

      if (existingMember) {
        return NextResponse.json(
          {
            success: false,
            error: "Team member with this email already exists",
          },
          { status: 400 }
        );
      }

      // Create new team member
      const teamMember = new TeamMember({
        ...body,
        userId: decoded.userId,
        email: body.email.toLowerCase(),
        status: body.status || "active",
        lastActive: new Date(),
        performance: 85,
        tasksCompleted: 0,
        joinDate: new Date(),
        teamProjects: [],
        teamTasks: [],
        skills: body.skills
          ? body.skills.split(",").map((s: string) => s.trim())
          : [],
      });

      await teamMember.save();

      // Create notification for team member addition
      try {
        await NotificationService.notifyTeamMemberAdded(
          teamMember,
          decoded.userId
        );
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }

      // Log team activity
      try {
        await TeamActivityHooks.onUserActivity(
          decoded.userId,
          teamMember._id.toString(),
          "joined"
        );
      } catch (activityError) {
        console.error("Failed to log team activity:", activityError);
      }

      return NextResponse.json(
        {
          success: true,
          data: teamMember,
          message: "Team member added successfully",
        },
        { status: 201 }
      );
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Create team member error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}