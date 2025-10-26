import dbConnect from "@/lib/dbConfig/db";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const params = url.searchParams;
    const limit = Math.min(Number(params.get("limit") || "10"), 100);
    const skip = Math.max(Number(params.get("skip") || "0"), 0);

    const posts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const payload = posts.map((p: any) => ({
      id: String(p._id),
      authorId: p.authorId ? String(p.authorId) : null,
      authorName: p.authorName,
      content: p.content,
      createdAt: p.createdAt,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching posts", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { content, authorId, authorName } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    let finalAuthorName = authorName || "Anonymous";

    if (authorId) {
      try {
        const user = (await UserModel.findById(authorId).lean()) as any;
        if (user) finalAuthorName = user.username || finalAuthorName;
      } catch (e) {
        // ignore lookup error
      }
    }

    const post = await PostModel.create({
      authorId: authorId || null,
      authorName: finalAuthorName,
      content: content.trim(),
    });

    return NextResponse.json({
      id: String(post._id),
      authorId: post.authorId ? String(post.authorId) : null,
      authorName: post.authorName,
      content: post.content,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error("Error creating post", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
