import { NextResponse } from "next/server";
import { registerUser } from "@/lib/users";
import { registerSchema } from "@/lib/validations";
import { ApiError, handleApi } from "@/lib/api/utils";

export async function POST(req) {
  return handleApi(async () => {
    const body = await req.json();
    const { email, password } = registerSchema.parse(body);

    try {
      const user = await registerUser(email, password);
      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          user,
        },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        throw new ApiError(400, error.message);
      }
      throw error;
    }
  }, { logMessage: "POST /api/auth/register error" });
}