import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { Id, EventResponse, ErrorResponse } from "@/lib/types";

type GetEventParams = {
  eventId: Id;
};

const getEventHandler: RouteHandler<GetEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<EventResponse | ErrorResponse>> => {
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

    // get the event
    const eventId = params.eventId;
    const event: EventResponse = await getEvent(eventId);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);

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
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch event",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(getEventHandler);
