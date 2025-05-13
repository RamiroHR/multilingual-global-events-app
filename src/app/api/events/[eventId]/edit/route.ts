import { NextRequest, NextResponse } from "next/server";
import { updateEvent } from "@/lib/events/index";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";

type EditEventParams = {
  eventId: string;
};

const editEventHandler: RouteHandler<EditEventParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    // Get the event Id from the URL
    if (!params?.eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }
    const { eventId } = params;

    // get the update data from the request body
    const updateData = await req.json();

    // Validate the update data
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Validate date format if provided
    if (updateData.date) {
      const date = new Date(updateData.date);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
      updateData.date = date;
    }

    // Validate maxCapacity if provided
    if (updateData.maxCapacity !== undefined) {
      if (
        typeof updateData.maxCapacity !== "number" ||
        updateData.maxCapacity < 1
      ) {
        return NextResponse.json(
          { error: "maxCapacity must be a positive number" },
          { status: 400 }
        );
      }
    }

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
