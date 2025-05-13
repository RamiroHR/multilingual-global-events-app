import { NextRequest, NextResponse } from "next/server";
import { updateEvent } from "@/lib/events/index";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";
import { updateEventSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";

type EditEventParams = {
  eventId: string;
};

const editEventHandler: RouteHandler<EditEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    // validate event Id exists in URL
    if (!params?.eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Validate request body
    const validationResult = await validateRequest(updateEventSchema)(req);
    if (validationResult instanceof NextResponse) return validationResult;

    // get the eventId & data to update from request
    const { eventId } = params;
    const updateData = validationResult.body;

    // Update the event
    const updatedEvent = await updateEvent(
      eventId,
      updateData,
      userData.userId
    );

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Event not found") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (error.message === "Not authorized to update this event") {
        return NextResponse.json(
          { error: "Not authorized to update this event" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
};

export const PUT = withAuth<EditEventParams>(editEventHandler);
