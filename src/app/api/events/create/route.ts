import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { createEvent } from "@/lib/events";

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // get token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = await verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // get verified user
    const userData = decoded as DecodedToken;

    // get event information from request body
    const { title, description, date, location, maxCapacity } =
      await req.json();

    // Validate required fields
    if (!title || !description || !date || !location || !maxCapacity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the event
    const event = await createEvent({
      title,
      description,
      date: new Date(date),
      location,
      maxCapacity,
      creatorId: Number(userData.userId),
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Authorization error:", error);
    return NextResponse.json(
      { error: "Authetication failed" },
      { status: 401 }
    );
  }
}
