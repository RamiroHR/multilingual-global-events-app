import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { createEventSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";

const createEventHandler: RouteHandler = async (req: NextRequest, userData: DecodedToken) => {
  try {
    // Validate request body
    const validationResult = await validateRequest(createEventSchema)(req);
    if (validationResult instanceof NextResponse) return validationResult;

    // get event information from validated request
    const { title, description, date, endDate, location, isOnline, maxCapacity, webinar } =
      validationResult.body;

    // Create the event
    const event = await createEvent({
      title,
      description,
      date: new Date(date),
      endDate: new Date(endDate),
      location,
      isOnline,
      maxCapacity,
      webinar,
      creatorId: userData.userId,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error Creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = withAuth(createEventHandler);
