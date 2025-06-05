import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/utils";
import { RouteHandler, ErrorResponse, AllCountriesResponse } from "@/lib/types";
import { getAllCountries } from "@/lib/events/utils";

const getAllCountriesHandler: RouteHandler = async (): Promise<
  NextResponse<AllCountriesResponse | ErrorResponse>
> => {
  try {
    const countries = await getAllCountries();
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch all countries",
      statusCode: 500,
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
};

export const GET = withAuth(getAllCountriesHandler);
