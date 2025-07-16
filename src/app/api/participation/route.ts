import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { getUserParticipations } from "@/lib/participation/utils";
import { ApplicationsResponse, ErrorResponse } from "@/lib/types";

const getUserParticipationsHandler: RouteHandler = async (
  req: NextRequest,
  userData: DecodedToken
): Promise<NextResponse<ApplicationsResponse | ErrorResponse>> => {
  try {
    // logic
    const applications: ApplicationsResponse = await getUserParticipations(userData.userId);
    return NextResponse.json(applications);
  } catch (error) {
    // handle errors
    console.error("Error fetching user applications", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch user applications",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(getUserParticipationsHandler);
