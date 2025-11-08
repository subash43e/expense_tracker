import { NextResponse } from "next/server";
import { ensureAuthenticated, handleApi } from "@/lib/api/utils";
import { getUserById } from "@/lib/users";

export async function GET(request) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);
    const user = await getUserById(userId);

    return NextResponse.json({ success: true, user }, { status: 200 });
  }, { logMessage: "GET /api/auth/me error" });
}