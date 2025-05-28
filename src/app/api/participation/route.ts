import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, DecodedToken } from "@/lib/types";
import { getUserParticipations } from "@/lib/participation/utils";

const getUserParticipationsHandler: RouteHandler = async (
  req: NextRequest,
  userData: DecodedToken
) => {
  try {
    // logic
    const applications = await getUserParticipations(userData.userId);
    return NextResponse.json(applications);
  } catch (error) {
    // handle errors
    console.error("Error fetching user applications", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(getUserParticipationsHandler);
