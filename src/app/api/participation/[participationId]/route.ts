import { NextRequest, NextResponse } from "next/server";
import { RouteHandler, DecodedToken, withAuth } from "@/lib/auth/index";
import { getApplicationById } from "@/lib/participation/utils";

type GetParticipationParams = {
  participationId: string;
};

const getParticipationHandler: RouteHandler<GetParticipationParams> = async (
  req: NextRequest,
  userData: DecodedToken,
  params
) => {
  try {
    if (!params?.participationId) {
      return NextResponse.json({ error: "Participation ID is required" }, { status: 400 });
    }

    const participation = await getApplicationById(params.participationId);

    // Verify the user is authorized to view this participation
    if (participation.userId !== Number(userData.userId)) {
      return NextResponse.json(
        { error: "Not authorized to view this participation" },
        { status: 403 }
      );
    }

    return NextResponse.json(participation);
  } catch (error) {
    console.error("Error fetching participation:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === "Participation not found") {
        return NextResponse.json({ error: "Participation not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET = withAuth(getParticipationHandler);
