import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Reason from "@/models/Reason";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const items = await Reason.find({}).sort({ order: 1 });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reasons." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { title, description, icon, order } = body;
    if (!title || !description || !icon || order === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newItem = await Reason.create({ title, description, icon, order });
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create reason." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing reason ID." }, { status: 400 });
    }

    const body = await req.json();
    const updatedItem = await Reason.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) {
      return NextResponse.json({ error: "Reason not found." }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch {
    return NextResponse.json({ error: "Failed to update reason." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing reason ID." }, { status: 400 });
    }

    const deletedItem = await Reason.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Reason not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedItem });
  } catch {
    return NextResponse.json({ error: "Failed to delete reason." }, { status: 500 });
  }
}
