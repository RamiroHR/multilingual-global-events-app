import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/user";
import { comparePassword, generateToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";
import { LoginRequest, AuthResponse, ErrorResponse } from "@/lib/types/routes";

export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse | ErrorResponse>> {
  try {
    // Validate request body and get the parsed body
    const validationResult = await validateRequest(loginSchema)(req);
    if (validationResult instanceof NextResponse) {
      const errorResponse: ErrorResponse = {
        error: "Validation error",
        message: "Invalid request data",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { email, password } = validationResult.body as LoginRequest;

    // Find if user exists and its stored hashedPassword
    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Compare password
    const isValid = await comparePassword(password, user.password.password);
    if (!isValid) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Create JWT
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const authResponse: AuthResponse = {
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      },
    };

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Error during login:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to login",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
