import { NextRequest, NextResponse } from "next/server";
import { updateParticipationStatus } from "@/lib/participation/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { updateParticipationStatusSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";

type UpdateParticipationStatusParams = {
  participationId: string;
};

const updateParticipationStatusHandler: RouteHandler<UpdateParticipationStatusParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    // Ensure participation ID is included
    if (!params?.participationId) {
      return NextResponse.json({ error: "Participation ID is required" }, { status: 400 });
    }

    // Validate request body and get the parsed body
    const validationResult = await validateRequest(updateParticipationStatusSchema)(req);
    if (validationResult instanceof NextResponse) return validationResult;

    const { status } = validationResult.body;
    const participationId = params.participationId;
    const eventCreatorId = userData.userId;

    // Update the participation status
    const updatedParticipation = await updateParticipationStatus(
      participationId,
      eventCreatorId,
      status
    );

    return NextResponse.json(updatedParticipation);
  } catch (error) {
    console.error("Error updating participation status:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Participation not found") {
        return NextResponse.json({ error: "Participation not found" }, { status: 404 });
      }
      if (error.message === "Not authorized to update this participation status") {
        return NextResponse.json(
          { error: "Not authorized to update this participation status" },
          { status: 403 }
        );
      }
      if (error.message.startsWith("Cannot update participation that is")) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (
        error.message == "The event was modified by another user. Please refresh and try again."
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

export const PATCH = withAuth<UpdateParticipationStatusParams>(updateParticipationStatusHandler);
