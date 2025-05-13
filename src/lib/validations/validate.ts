import { NextRequest, NextResponse } from "next/server";
import { AnySchema } from "yup";

export const validateRequest = (schema: AnySchema) => {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      await schema.validate(body, { abortEarly: false });
      return { body }; // Return the parsed body instead of null
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.message,
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
  };
};
