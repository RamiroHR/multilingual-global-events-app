import { NextResponse } from "next/server";
import { getEventsByCreator } from "@/lib/events/utils";
import { RouteHandler, withAuth } from "@/lib/auth/index";

const getMyEventsHandler: RouteHandler = async (req, userData) => {
  try {
    const events = await getEventsByCreator(userData.userId);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(getMyEventsHandler);
