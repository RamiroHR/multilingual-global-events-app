import { NextRequest, NextResponse } from "next/server";
import { applyToEvent } from "@/lib/participation/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { Id, ApplicationResponse, ErrorResponse } from "@/lib/types";

type ApplyEventParams = {
  eventId: Id;
};

const applyEventHandler: RouteHandler<ApplyEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<ApplicationResponse | ErrorResponse>> => {
  try {
    // ensure event Id is included
    if (!params?.eventId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Event ID is required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // get event_id and participant_id from url
    const eventId = params.eventId;
    const userId = userData.userId;

    // create application to event
    const application: ApplicationResponse = await applyToEvent(eventId, userId);
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error applying to event:", error);

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
      if (error.message === "You already have applied to this event") {
        const errorResponse: ErrorResponse = {
          error: "Bad Request",
          message: "You already have applied to this event",
          statusCode: 400,
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
      if (error.message.includes("capacity")) {
        const errorResponse: ErrorResponse = {
          error: "Bad Request",
          message: "Event has reached maximum capacity. Another user has taken the last spot.",
          statusCode: 400,
        };
        return NextResponse.json(errorResponse, { status: 400 });
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
      message: "Failed to apply to event",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const POST = withAuth<ApplyEventParams>(applyEventHandler);
