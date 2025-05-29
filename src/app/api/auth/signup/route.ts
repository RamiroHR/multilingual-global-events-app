import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/user";
import { hashPassword } from "@/lib/jwt";
import { signupSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";
import { SignupRequest, AuthResponse, ErrorResponse } from "@/lib/types/routes";

export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse | ErrorResponse>> {
  try {
    // Validate request body and get the parsed body
    const validationResult = await validateRequest(signupSchema)(req);
    if (validationResult instanceof NextResponse) {
      const errorResponse: ErrorResponse = {
        error: "Validation error",
        message: "Invalid request data",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { email, username, password } = validationResult.body as SignupRequest;

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      const errorResponse: ErrorResponse = {
        error: "Conflict",
        message: "Email already in use",
        statusCode: 409,
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and password
    const user = await createUser(email, username, hashedPassword);

    const authResponse: AuthResponse = {
      token: "", // No token on signup, user needs to login
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      },
    };

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Error during signup:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to create user",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
