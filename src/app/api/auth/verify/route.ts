import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);

    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    return NextResponse.json({
      userId: authResult.userData?.userId,
      email: authResult.userData?.email,
      username: authResult.userData?.username,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
