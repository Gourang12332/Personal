import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const items = await Message.find({}).sort({ order: 1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { title, content, order } = body;
    if (!title || !content || order === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newItem = await Message.create({ title, content, order });
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create message." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing message ID." }, { status: 400 });
    }

    const body = await req.json();
    const updatedItem = await Message.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing message ID." }, { status: 400 });
    }

    const deletedItem = await Message.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedItem });
  } catch {
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
