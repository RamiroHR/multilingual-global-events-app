import { NextRequest, NextResponse } from "next/server";

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export type RouteHandler = (
  req: NextRequest,
  userData: DecodedToken,
  params?: { eventId: string }
) => Promise<NextResponse>;
