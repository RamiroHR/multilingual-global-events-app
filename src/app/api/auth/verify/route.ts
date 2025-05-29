import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth/utils";
import { AuthResponse, ErrorResponse } from "@/lib/types/routes";

export async function GET(req: NextRequest): Promise<NextResponse<AuthResponse | ErrorResponse>> {
  try {
    const authResult = await verifyAuth(req);

    if (!authResult.success) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: authResult.error || "Invalid token",
        statusCode: authResult.status || 401,
      };
      return NextResponse.json(errorResponse, { status: authResult.status || 401 });
    }

    const authResponse: AuthResponse = {
      token: "", // No new token on verify
      user: {
        id: authResult.userData!.userId,
        email: authResult.userData!.email,
        username: authResult.userData!.username || "",
      },
    };

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Error verifying token:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to verify token",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
