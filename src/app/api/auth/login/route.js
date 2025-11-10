import { NextResponse } from "next/server";
import { loginUser } from "@/lib/users";
import { loginSchema } from "@/lib/validations";
import { ApiError, handleApi } from "@/lib/api/utils";

export async function POST(req) {
  return handleApi(async () => {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    try {
      const result = await loginUser(email, password);
      return NextResponse.json(
        {
          success: true,
          token: result.token,
          user: result.user,
        },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        throw new ApiError(401, error.message);
      }
      throw error;
    }
  }, { logMessage: "POST /api/auth/login error" });
}