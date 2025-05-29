import { NextResponse } from "next/server";
import { getEventsByCreator } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler } from "@/lib/types";
import { EventsResponse, ErrorResponse } from "@/lib/types/routes";

const getMyEventsHandler: RouteHandler = async (
  req,
  userData
): Promise<NextResponse<EventsResponse | ErrorResponse>> => {
  try {
    const events = await getEventsByCreator(userData.userId);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch user events",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(getMyEventsHandler);
