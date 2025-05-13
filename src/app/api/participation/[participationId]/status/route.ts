import { NextRequest, NextResponse } from "next/server";
import { updateParticipationStatus } from "@/lib/participation";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";

type UpdateParticipationStatusParams = {
  participationId: string;
};

const updateParticipationStatusHandler: RouteHandler<
  UpdateParticipationStatusParams
> = async (req: NextRequest, userData: DecodedToken, params) => {
  try {
    // Ensure participation ID is included
    if (!params?.participationId) {
      return NextResponse.json(
        { error: "Participation ID is required" },
        { status: 400 }
      );
    }

    // Get the new status from the request body
    const { status } = await req.json();

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status (APPROVED or REJECTED) is required" },
        { status: 400 }
      );
    }

    const participationId = params.participationId;
    const eventCreatorId = userData.userId;

    // Update the participation status
    const updatedParticipation = await updateParticipationStatus({
      participationId,
      eventCreatorId,
      newStatus: status as "APPROVED" | "REJECTED",
    });

    return NextResponse.json(updatedParticipation);
  } catch (error) {
    console.error("Error updating participation status:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Participation not found") {
        return NextResponse.json(
          { error: "Participation not found" },
          { status: 404 }
        );
      }
      if (
        error.message === "Not authorized to update this participation status"
      ) {
        return NextResponse.json(
          { error: "Not authorized to update this participation status" },
          { status: 403 }
        );
      }
      if (error.message.startsWith("Cannot update participation that is")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PATCH = withAuth<UpdateParticipationStatusParams>(
  updateParticipationStatusHandler
);
