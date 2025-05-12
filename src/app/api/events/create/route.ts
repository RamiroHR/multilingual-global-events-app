import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/events";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userData = authResult.userData!;

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
