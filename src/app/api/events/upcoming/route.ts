import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler } from "@/lib/types";
import { EventsResponse, ErrorResponse } from "@/lib/types/routes";

const getUpcomingEventsHandler: RouteHandler = async (
  req
): Promise<NextResponse<EventsResponse | ErrorResponse>> => {
  try {
    //Get page from query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const { events, hasMore }: EventsResponse = await getUpcomingEvents(page);
    return NextResponse.json({ events, hasMore });
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
