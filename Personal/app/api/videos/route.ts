import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Video from "@/models/Video";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const items = await Video.find({}).sort({ createdAt: 1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch videos." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { title, videoUrl, description } = body;
    if (!title || !videoUrl || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newItem = await Video.create({ title, videoUrl, description });
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create video." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing video ID." }, { status: 400 });
    }

    const body = await req.json();
    const updatedItem = await Video.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json({ error: "Failed to update video." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing video ID." }, { status: 400 });
    }

    const deletedItem = await Video.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedItem });
  } catch {
    return NextResponse.json({ error: "Failed to delete video." }, { status: 500 });
  }
}
