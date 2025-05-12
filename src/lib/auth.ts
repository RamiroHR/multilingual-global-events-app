import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

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
