import { NextRequest, NextResponse } from "next/server";
import { signToken, isAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured on the server." },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const token = signToken({ email });
      const response = NextResponse.json({ success: true, token });
      
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "An error occurred during authentication." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = isAuthenticated(req);
  return NextResponse.json({ authenticated: auth });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
