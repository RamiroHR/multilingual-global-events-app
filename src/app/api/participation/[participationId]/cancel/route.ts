import { NextRequest, NextResponse } from "next/server";
import { cancelParticipation } from "@/lib/participation";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";

type CancelParticipationParams = {
  participationId: string;
};

const cancelParticipationHandler: RouteHandler<CancelParticipationParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    // Ensure participation ID is included
    if (!params?.participationId) {
      return NextResponse.json({ error: "Participation ID is required" }, { status: 400 });
    }

    const participationId = params.participationId;
    const userId = userData.userId;

    // Update participation status to CANCELLED
    const cancelledParticipation = await cancelParticipation({
      participationId: Number(participationId),
      userId: Number(userId),
    });

    return NextResponse.json(cancelledParticipation);
  } catch (error) {
    console.error("Error cancelling participation:", error);

    // Handle specific errors:
    if (error instanceof Error) {
      if (error.message === "Participation not found") {
        return NextResponse.json({ error: "Participation not found" }, { status: 404 });
      }
      if (error.message === "Not authorized to cancel this participation") {
        return NextResponse.json(
          { error: "Not authorized to cancel this participation" },
          { status: 403 }
        );
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

export const DELETE = withAuth<CancelParticipationParams>(cancelParticipationHandler);
