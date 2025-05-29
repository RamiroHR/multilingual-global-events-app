import { NextRequest, NextResponse } from "next/server";
import { createEvent } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { createEventSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";
import { EventResponse, ErrorResponse } from "@/lib/types/routes";

const createEventHandler: RouteHandler = async (
  req: NextRequest,
  userData: DecodedToken
): Promise<NextResponse<EventResponse | ErrorResponse>> => {
  try {
    // Validate request body
    const validationResult = await validateRequest(createEventSchema)(req);
    if (validationResult instanceof NextResponse) {
      const errorResponse: ErrorResponse = {
        error: "Validation error",
        message: "Invalid request data",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // get event information from validated request
    const { title, description, date, endDate, location, isOnline, maxCapacity, webinar } =
      validationResult.body;

    // Create the event
    const event: EventResponse = await createEvent({
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
    const errorResponse: ErrorResponse = {
      error: "Internal server error",
      message: "Failed to create event",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const POST = withAuth(createEventHandler);
