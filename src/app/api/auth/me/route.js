import { NextResponse } from "next/server";
import { ensureAuthenticated, handleApi } from "@lib/api/utils";
import { getUserById } from "@lib/users";

export  function GET(request) {
  return handleApi(async () => {
    const userId =  ensureAuthenticated(request);
    console.log(userId);
    const user = getUserById(userId);

    return NextResponse.json({ success: true, user }, { status: 200 });
  }, { logMessage: "GET /api/auth/me error" });
}