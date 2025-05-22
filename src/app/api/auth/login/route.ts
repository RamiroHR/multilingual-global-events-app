import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/user";
import { comparePassword, generateToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";

export async function POST(req: NextRequest) {
  try {
    // Validate request body and get the parsed body
    const validationResult = await validateRequest(loginSchema)(req);
    if (validationResult instanceof NextResponse) return validationResult;

    const { email, password } = validationResult.body;

    // Find if user exists and its stored hashedPassword
    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const isValid = await comparePassword(password, user.password.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await generateToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      token,
      userId: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
