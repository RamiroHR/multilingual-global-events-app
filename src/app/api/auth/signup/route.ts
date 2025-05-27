import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/user";
import { hashPassword } from "@/lib/jwt";
import { signupSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";

export async function POST(req: NextRequest) {
  try {
    // Validate request body and get the parsed body
    const validationResult = await validateRequest(signupSchema)(req);
    if (validationResult instanceof NextResponse) return validationResult;

    const { email, username, password } = validationResult.body;

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and password
    const user = await createUser(email, username, hashedPassword);

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
