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
      
      const response = NextResponse.json(
        {
          success: true,
          user: result.user,
        },
        { status: 200 }
      );
      
      response.cookies.set({
        name: "token",
        value: result.token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      
      return response;
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        throw new ApiError(401, error.message);
      }
      throw error;
    }
  }, { logMessage: "POST /api/auth/login error" });
}