import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/events/utils";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";

type GetEventParams = {
  eventId: string;
};

const getEventHandler: RouteHandler<GetEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    // ensure event Id is included
    if (!params?.eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // get the event
    const eventId = params.eventId;
    const event = await getEvent(eventId);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Event not found") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(getEventHandler);
