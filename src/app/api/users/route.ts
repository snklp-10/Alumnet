import dbConnect from "@/lib/dbConfig/db";
import UserModel from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";

// GET /api/users?role=alumni&exclude=<id>&limit=5
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const role = url.searchParams.get("role");
    const exclude = url.searchParams.get("exclude");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const filter: any = {};
    if (role) filter.role = role;
    if (exclude) {
      // try to convert exclude to ObjectId; if invalid, fallback to string compare
      try {
        filter._id = { $ne: new mongoose.Types.ObjectId(exclude) };
      } catch (e) {
        filter._id = { $ne: exclude };
      }
    }

    const users = await UserModel.find(filter, null, {
      limit,
      sort: { createdAt: -1 },
    }).lean();

    const payload = users.map((u: any) => ({
      id: String(u._id),
      username: u.username || "",
      role: u.role,
      profileImage: u.profileImage || "",
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
