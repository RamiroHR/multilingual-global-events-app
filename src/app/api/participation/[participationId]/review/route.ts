import { NextRequest, NextResponse } from "next/server";
import { updateParticipationStatus } from "@/lib/participation/utils";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { updateParticipationStatusSchema } from "@/lib/validations/schemas";
import { validateRequest } from "@/lib/validations/validate";
import { Id, ApplicationResponse, ErrorResponse, ReviewApplicationRequest } from "@/lib/types";

type UpdateParticipationStatusParams = {
  participationId: Id;
};

const updateParticipationStatusHandler: RouteHandler<UpdateParticipationStatusParams> = async (
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

    // Validate request body and get the parsed body
    const validationResult = await validateRequest(updateParticipationStatusSchema)(req);
    if (validationResult instanceof NextResponse) {
      const errorResponse: ErrorResponse = {
        error: "Validation error",
        message: "Invalid request data",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { status } = validationResult.body as ReviewApplicationRequest;
    const participationId = params.participationId;
    const eventCreatorId = userData.userId;

    // Update the participation status
    const updatedParticipation: ApplicationResponse = await updateParticipationStatus(
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
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Participation not found",
          statusCode: 404,
        };
        return NextResponse.json(errorResponse, { status: 404 });
      }
      if (error.message === "Not authorized to update this participation status") {
        const errorResponse: ErrorResponse = {
          error: "Forbidden",
          message: "Not authorized to update this participation status",
          statusCode: 403,
        };
        return NextResponse.json(errorResponse, { status: 403 });
      }
      if (error.message.startsWith("Cannot update participation that is")) {
        const errorResponse: ErrorResponse = {
          error: "Bad Request",
          message: error.message,
          statusCode: 400,
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
      if (
        error.message === "The event was modified by another user. Please refresh and try again."
      ) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "The application was modified by another user. Please refresh and try again.",
          statusCode: 409,
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to update participation status",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const PATCH = withAuth<UpdateParticipationStatusParams>(updateParticipationStatusHandler);
