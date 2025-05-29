import { NextRequest, NextResponse } from "next/server";
import { updateEvent } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { updateEventSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";
import { Id, EventResponse, ErrorResponse } from "@/lib/types";

type EditEventParams = {
  eventId: Id;
};

const editEventHandler: RouteHandler<EditEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<EventResponse | ErrorResponse>> => {
  try {
    // validate event Id exists in URL
    if (!params?.eventId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Event ID is required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate request body
    const validationResult = await validateRequest(updateEventSchema)(req);
    if (validationResult instanceof NextResponse) {
      const errorResponse: ErrorResponse = {
        error: "Validation error",
        message: "Invalid request data",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // get the eventId & data to update from request
    const { eventId } = params;
    const updateData = validationResult.body;

    // Update the event
    const updatedEvent = await updateEvent(eventId, updateData, userData.userId);

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Event not found") {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Event not found",
          statusCode: 404,
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }
      if (error.message === "Not authorized to update this event") {
        const errorResponse: ErrorResponse = {
          error: "Forbidden",
          message: "Not authorized to update this event",
          statusCode: 403,
        };
        return NextResponse.json(errorResponse, { status: 403 });
      }
      if (
        error.message === "The event was modified by another user. Please refresh and try again."
      ) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "The event was modified by another user. Please refresh and try again.",
          statusCode: 409,
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to update event",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const PUT = withAuth<EditEventParams>(editEventHandler);
