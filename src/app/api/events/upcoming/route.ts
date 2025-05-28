import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/events/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler } from "@/lib/types";

const EVENTS_PER_PAGE = 12;

const getUpcomingEventsHandler: RouteHandler = async () => {
  try {
    const events = await getUpcomingEvents(EVENTS_PER_PAGE);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(getUpcomingEventsHandler);
