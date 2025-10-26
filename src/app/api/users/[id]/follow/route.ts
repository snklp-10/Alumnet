import dbConnect from "@/lib/dbConfig/db";
import UserModel from "@/models/User";
import { NextResponse, NextRequest } from "next/server";

// POST /api/users/:id/follow
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 handle as Promise
) {
  try {
    await dbConnect();

    const { id: targetId } = await context.params; // ✅ fixed
    const body = await request.json();
    const followerId = body?.followerId;

    if (!followerId) {
      return NextResponse.json(
        { error: "followerId required" },
        { status: 400 }
      );
    }

    if (followerId === targetId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const targetUser = await UserModel.findById(targetId);
    const followerUser = await UserModel.findById(followerId);

    if (!targetUser || !followerUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyFollowing = (targetUser.followers || []).some(
      (f: any) => String(f) === String(followerId)
    );

    if (alreadyFollowing) {
      targetUser.followers = (targetUser.followers || []).filter(
        (f: any) => String(f) !== String(followerId)
      );
      followerUser.following = (followerUser.following || []).filter(
        (f: any) => String(f) !== String(targetId)
      );
      await targetUser.save();
      await followerUser.save();
      return NextResponse.json({
        success: true,
        action: "unfollowed",
        user: { id: String(targetUser._id), username: targetUser.username },
      });
    }

    targetUser.followers = Array.from(
      new Set([...(targetUser.followers || []), followerId])
    );
    followerUser.following = Array.from(
      new Set([...(followerUser.following || []), targetId])
    );

    await targetUser.save();
    await followerUser.save();

    return NextResponse.json({
      success: true,
      action: "followed",
      user: { id: String(targetUser._id), username: targetUser.username },
    });
  } catch (error) {
    console.error("Error toggling follow", error);
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    );
  }
}
