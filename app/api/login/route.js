import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { passkey } = await req.json();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const token = generateToken();
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in /api/login:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

function generateToken() {
  const payload = { role: "admin" };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
}
