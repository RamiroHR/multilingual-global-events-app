import { NextRequest, NextResponse } from "next/server";
import { applyToEvent } from "@/lib/participation/utils";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";
import { Id } from "@/lib/types";

type ApplyEventParams = {
  eventId: Id;
};

const applyEventHandler: RouteHandler<ApplyEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    // ensure event Id is included
    if (!params?.eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // get event_id and participant_id from url
    const eventId = params.eventId;
    const userId = userData.userId;

    // create application to event
    const application = await applyToEvent(eventId, userId);
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error applying to event:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Event not found") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (error.message === "You have already applied to this event") {
        return NextResponse.json(
          { error: "You have already applied to this event" },
          { status: 400 }
        );
      }
      if (error.message === "Event has reached maximum capacity") {
        return NextResponse.json({ error: "Event has reached maximum capacity" }, { status: 400 });
      }
      if (
        error.message === "The event was modified by another user. Please refresh and try again."
      ) {
        return NextResponse.json(
          { error: "The event was modified by another user. Please refresh and try again." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = withAuth<ApplyEventParams>(applyEventHandler);
