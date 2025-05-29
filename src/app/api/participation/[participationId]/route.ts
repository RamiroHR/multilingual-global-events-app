import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { getApplicationById } from "@/lib/participation/utils";
import { Id, ApplicationResponse, ErrorResponse } from "@/lib/types";

type GetParticipationParams = {
  participationId: Id;
};

const getParticipationHandler: RouteHandler<GetParticipationParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
): Promise<NextResponse<ApplicationResponse | ErrorResponse>> => {
  try {
    if (!params?.participationId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Participation ID is required",
        statusCode: 400,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const participation: ApplicationResponse = await getApplicationById(params.participationId);

    // Verify the user is authorized to view this participation
    if (participation.userId !== Number(userData.userId)) {
      const errorResponse: ErrorResponse = {
        error: "Forbidden",
        message: "Not authorized to view this participation",
        statusCode: 403,
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    return NextResponse.json(participation);
  } catch (error) {
    console.error("Error fetching participation:", error);

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
    }

    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch participation",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(getParticipationHandler);
