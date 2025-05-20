import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/events/index";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";
import { createEventSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";

const createEventHandler: RouteHandler = async (
  req: NextRequest,
  userData: DecodedToken
) => {
  try {
    // Validate request body
    const validationResult = await validateRequest(createEventSchema)(req);
    if (validationResult instanceof NextResponse) return validationResult;

    // get event information from validated request
    const {
      title,
      description,
      date,
      location,
      isOnline,
      maxCapacity,
      webinar,
    } = validationResult.body;

    // Create the event
    const event = await createEvent({
      title,
      description,
      date: new Date(date),
      location,
      isOnline,
      maxCapacity,
      webinar,
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
