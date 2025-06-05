import { NextResponse } from "next/server";
import { getEventsByCreator } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler } from "@/lib/types";
import { MyEventsResponse, ErrorResponse, MyEventsParams } from "@/lib/types/routes";

const getMyEventsHandler: RouteHandler<MyEventsParams> = async (
  req,
  userData
): Promise<NextResponse<MyEventsResponse | ErrorResponse>> => {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const timeFilter = searchParams.get("timeFilter") as "all" | "future" | "past" | null;
    const orderBy = searchParams.get("orderBy") as "asc" | "desc" | null;

    const events = await getEventsByCreator(userData.userId, {
      timeFilter: timeFilter || "all",
      orderBy: orderBy || "asc",
    });

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
