import { NextRequest, NextResponse } from "next/server";

export interface DecodedToken {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  iat: number;
  exp: number;
}

export type RouteHandler<TParams = undefined> = (
  req: NextRequest,
  userData: DecodedToken,
  params?: TParams
) => Promise<NextResponse>;
