import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../jwt";
import { DecodedToken, RouteHandler } from "./types";

export async function verifyAuth(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer")) {
      return {
        success: false,
        error: "Unauthorized - No token provided",
        status: 401,
      };
    }

    // get token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = await verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return {
        success: false,
        error: "Unauthorized - Invalid token",
        status: 401,
      };
    }

    // get verified user
    const userData = decoded as DecodedToken;

    return {
      success: true,
      userData,
    };
  } catch (error) {
    console.error("Authentication error", error);
    return {
      success: false,
      error: "Authentication failed",
      status: 401,
    };
  }
}

/**
 * Higher-order function that wraps API route handlers with authentication.
 * Verifies JWT token and provides user data to the handler if authentication succeeds.
 *
 * @param handler - The API route handler to be wrapped with authentication
 * @returns A function matching Next.js API route signature: a handler with authentication middleware
 */
export function withAuth<TParams>(handler: RouteHandler<TParams>) {
  return async (req: NextRequest, context: { params: TParams }) => {
    // Verify JWT token and decode user data
    const authResult = await verifyAuth(req);

    // Handle authentication failure
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Handle missing user data
    if (!authResult.userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 500 });
    }

    // Execute the original handler with authenticated user data
    return handler(req, authResult.userData, context.params);
  };
}
