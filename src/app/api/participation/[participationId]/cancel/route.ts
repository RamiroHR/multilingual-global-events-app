import { NextRequest, NextResponse } from "next/server";
import { cancelParticipation } from "@/lib/participation/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { Id, ApplicationResponse, ErrorResponse } from "@/lib/types";

type CancelParticipationParams = {
  participationId: Id;
};

const cancelParticipationHandler: RouteHandler<CancelParticipationParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<ApplicationResponse | ErrorResponse>> => {
  try {
    // Ensure participation ID is included
    if (!params?.participationId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Participation ID is required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const participationId = params.participationId;
    const userId = userData.userId;

    // Update participation status to CANCELLED
    const cancelledParticipation: ApplicationResponse = await cancelParticipation(
      participationId,
      userId
    );

    return NextResponse.json(cancelledParticipation);
  } catch (error) {
    console.error("Error cancelling participation:", error);

    // Handle specific errors:
    if (error instanceof Error) {
      if (error.message === "Participation not found") {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Participation not found",
          statusCode: 404,
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }
      if (error.message === "Not authorized to cancel this participation") {
        const errorResponse: ErrorResponse = {
          error: "Forbidden",
          message: "Not authorized to cancel this participation",
          statusCode: 403,
        };
        return NextResponse.json(errorResponse, { status: 403 });
      }
      if (
        error.message === "The event was modified by another user. Please refresh and try again."
      ) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "The event was modified by another user. Please refresh and try again.",
          statusCode: 409,
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to cancel participation",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const DELETE = withAuth<CancelParticipationParams>(cancelParticipationHandler);
