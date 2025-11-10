import { NextResponse } from "next/server";
import { handleApi, ensureAuthenticated } from "@lib/api/utils";
import deleteAllExpenses from "../handlers/deleteAllExpenses";

export async function POST(req) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(req);
    await deleteAllExpenses(userId);
    return NextResponse.json(
      { success: true, message: "All expenses deleted successfully" },
      { status: 200 }
    );
  }, { logMessage: "POST /api/expenses/deleteAll error" });
}
