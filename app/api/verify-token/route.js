import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { token } = await req.json();
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
