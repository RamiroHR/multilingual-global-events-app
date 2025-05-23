import { getEventApplications } from "@/lib/participation/index";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";
import { NextRequest, NextResponse } from "next/server";

type EventApplicationsParams = {
  eventId: string;
};

const handleGetEventApplications: RouteHandler<EventApplicationsParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    if (!params?.eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // set creator id and event id
    const eventId = params.eventId;
    const creatorId = userData.userId;

    // get applications for the event
    const eventApplications = await getEventApplications({ eventId, creatorId });
    return NextResponse.json(eventApplications);
  } catch (error) {
    // handle errors
    console.error("Error fetching applications to the event:", error);

    if (error instanceof Error) {
      if (error.message === "Event not found") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (error.message === "User not authorized to see applications of this event") {
        return NextResponse.json(
          { error: "Not authorized to see applications for this event" },
          { status: 403 }
        );
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(handleGetEventApplications);
