import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";
import { getUserParticipations } from "@/lib/participation/index";

const getUserParticipationsHandler: RouteHandler = async (
  req: NextRequest,
  userData: DecodedToken
) => {
  try {
    // logic
    const applications = await getUserParticipations({
      userId: Number(userData.userId),
    });
    return NextResponse.json(applications);
  } catch (error) {
    // handle errors
    console.error("Error fetching user applications", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(getUserParticipationsHandler);
