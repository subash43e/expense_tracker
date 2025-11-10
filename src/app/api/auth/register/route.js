import { NextResponse } from "next/server";
import { registerUser } from "@/lib/users";
import { registerSchema } from "@/lib/validations";
import { ApiError, handleApi } from "@/lib/api/utils";

export async function POST(req) {
  return handleApi(async () => {
    const body = await req.json();
    const { email, password } = registerSchema.parse(body);

    try {
      const result = await registerUser(email, password);
      
      const response = NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          user: result.user,
        },
        { status: 201 }
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
      if (error instanceof Error && error.message === "User already exists") {
        throw new ApiError(400, error.message);
      }
      throw error;
    }
  }, { logMessage: "POST /api/auth/register error" });
}