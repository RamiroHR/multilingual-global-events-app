import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/events/index";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";

const createEventHandler: RouteHandler = async (
  req: NextRequest,
  userData: DecodedToken
) => {
  try {
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
    console.error("Error Creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(createEventHandler);
