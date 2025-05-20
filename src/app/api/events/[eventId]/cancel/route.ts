import { NextRequest, NextResponse } from "next/server";
import { cancelEvent } from "@/lib/events/utils";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";

type CancelEventParams = {
  eventId: string;
};

const cancelEventHandler: RouteHandler<CancelEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    if (!params?.eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const event = await cancelEvent(params.eventId, userData.userId);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error cancelling event:", error);

    if (error instanceof Error) {
      if (error.message === "Event not found") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (error.message === "Not authorized to cancel this event") {
        return NextResponse.json(
          { error: "Not authorized to cancel this event" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PATCH = withAuth<CancelEventParams>(cancelEventHandler);
