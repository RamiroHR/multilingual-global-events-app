import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler } from "@/lib/types";
import { EventsResponse, ErrorResponse } from "@/lib/types/routes";

const EVENTS_PER_PAGE = 12;

const getUpcomingEventsHandler: RouteHandler = async (): Promise<
  NextResponse<EventsResponse | ErrorResponse>
> => {
  try {
    const events: EventsResponse = await getUpcomingEvents(EVENTS_PER_PAGE);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch upcoming events",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(getUpcomingEventsHandler);
