import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { PaymentService } from '@/services/paymentService';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, name, image, githubId } = await request.json();

    // 1. Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for GitHub Social Registration
      user = new User({
        name,
        email,
        password: githubId, // Using GitHub ID as placeholder
        image,
        isActive: true,
        role: 'user',
      });
      await user.save();
      
      // Start free trial for new users
      await PaymentService.startFreeTrial(user._id.toString());
    }

    // 2. Generate System Token (Matches your Google/Login flow)
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName,
      isActive: user.isActive,
    };

    const response = NextResponse.json({ user: userData, token });

    // 3. Set standard HTTP-Only Cookies
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GitHub Auth Bridge Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}