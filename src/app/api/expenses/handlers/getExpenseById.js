import { NextResponse } from "next/server";
import { getExpenseById } from "@/lib/expenses";
import {
  ApiError,
  ensureAuthenticated,
  handleApi,
  resolveAndValidateObjectId,
} from "@/lib/api/utils";

export async function handleGetExpenseById(request, params) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);
    const id = await resolveAndValidateObjectId(params);

    const expense = await getExpenseById(id, userId);
    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }
    return NextResponse.json({ success: true, data: expense });
  }, { logMessage: "GET /api/expenses/[id] error" });
}