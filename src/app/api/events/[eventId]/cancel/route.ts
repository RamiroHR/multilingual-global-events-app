import { NextRequest, NextResponse } from "next/server";
import { cancelEvent } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { Id, EventResponse, ErrorResponse } from "@/lib/types";

type CancelEventParams = {
  eventId: Id;
};

const cancelEventHandler: RouteHandler<CancelEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<EventResponse | ErrorResponse>> => {
  try {
    if (!params?.eventId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Event ID is required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Get version from request body
    const body = await req.json();
    const version = body.version;

    if (typeof version !== "number") {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Version is required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const event: EventResponse = await cancelEvent(params.eventId, userData.userId, version);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error cancelling event:", error);

    if (error instanceof Error) {
      if (error.message === "Event not found") {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Event not found",
          statusCode: 404,
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }
      if (error.message === "Not authorized to cancel this event") {
        const errorResponse: ErrorResponse = {
          error: "Forbidden",
          message: "Not authorized to cancel this event",
          statusCode: 403,
        };
        return NextResponse.json(errorResponse, { status: 403 });
      }
      if (error.message === "The event was already cancelled") {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "The event was already cancelled",
          statusCode: 409,
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }
      if (
        error.message === "The event was modified by another user. Please refresh and try again."
      ) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "The event was already cancelled by another user. Please continue to refresh.",
          statusCode: 409,
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to cancel event",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const PATCH = withAuth<CancelEventParams>(cancelEventHandler);
