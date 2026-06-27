import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Memory from "@/models/Memory";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const items = await Memory.find({}).sort({ date: -1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch memories." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { image, caption, date, category } = body;
    if (!image || !caption || !date || !category) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newItem = await Memory.create({ image, caption, date, category });
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create memory." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing memory ID." }, { status: 400 });
    }

    const body = await req.json();
    const updatedItem = await Memory.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json({ error: "Failed to update memory." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing memory ID." }, { status: 400 });
    }

    const deletedItem = await Memory.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedItem });
  } catch {
    return NextResponse.json({ error: "Failed to delete memory." }, { status: 500 });
  }
}
