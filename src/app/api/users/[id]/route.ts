import { getUserInfo, updateUserInfo } from "@/lib/server-action/auth-action";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users/[id]
export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    // Next.js may provide a promise-like params object in route handlers — await it before using
    const { id } = await params;
    const result = await getUserInfo(id);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id]
export async function PATCH(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = await params;
    if (!id)
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );

    const body = await request.json();
    const result = await updateUserInfo(id, body);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
