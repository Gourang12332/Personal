import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const birthdayDate = process.env.BIRTHDAY_DATE || "";
    const hintsString = process.env.SURPRISE_HINTS || "What is my favorite person's name?;6 letters, starts with 'S' and ends with 'L'";
    const hints = hintsString.split(";").map(h => h.trim()).filter(h => h.length > 0);

    return NextResponse.json({
      birthdayDate,
      hints,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch configurations." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    const targetPasscode = process.env.SURPRISE_PASSCODE || "shejal";

    const isMatch = passcode.trim().toLowerCase() === targetPasscode.trim().toLowerCase();

    return NextResponse.json({ success: isMatch });
  } catch {
    return NextResponse.json({ error: "Failed to validate passcode." }, { status: 500 });
  }
}
