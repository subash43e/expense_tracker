import { NextResponse } from "next/server";
import { handleApi } from "@/lib/api/utils";
import { generateCsrfToken, setCsrfCookie } from "@/lib/security/csrf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handleApi(async () => {
    const token = generateCsrfToken();
    const response = NextResponse.json({ success: true, token });
    setCsrfCookie(response, token);
    return response;
  }, { logMessage: "GET /api/auth/csrf error" });
}
