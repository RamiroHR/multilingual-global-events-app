import { getEventApplications } from "@/lib/participation/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { Id, EventApplicationsResponse, ErrorResponse } from "@/lib/types";

type EventApplicationsParams = {
  eventId: Id;
};

const handleGetEventApplications: RouteHandler<EventApplicationsParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<EventApplicationsResponse | ErrorResponse>> => {
  try {
    if (!params?.eventId) {
      const errorResponse: ErrorResponse = {
        error: "Bad request",
        message: "Event ID ir required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // set creator id and event id
    const eventId = params.eventId;
    const creatorId = userData.userId;

    // get applications for the event
    const eventApplications: EventApplicationsResponse = await getEventApplications(
      eventId,
      creatorId
    );
    return NextResponse.json(eventApplications);
  } catch (error) {
    // handle errors
    console.error("Error fetching applications to the event:", error);

    if (error instanceof Error) {
      if (error.message === "Event not found") {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Event not found",
          statusCode: 404,
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }
      if (error.message === "User not authorized to see applications of this event") {
        const errorResponse: ErrorResponse = {
          error: "Forbidden",
          message: "Not authorized to see applications for this event",
          statusCode: 403,
        };
        return NextResponse.json(errorResponse, { status: 403 });
      }
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch event applications",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(handleGetEventApplications);
