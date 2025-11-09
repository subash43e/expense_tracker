import { NextResponse } from "next/server";
import { deleteExpense } from "@/lib/expenses";
import {
  ApiError,
  ensureAuthenticated,
  handleApi,
  resolveAndValidateObjectId,
} from "@/lib/api/utils";
import { validateCsrfToken } from "@/lib/security/csrf";

export async function handleDeleteExpense(request, params) {
  return handleApi(async () => {
    validateCsrfToken(request);
    const userId = ensureAuthenticated(request);
    const id = await resolveAndValidateObjectId(params);

    const expense = await deleteExpense(id, userId);
    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }
    return NextResponse.json({ success: true, data: {} });
  }, { logMessage: "DELETE /api/expenses/[id] error" });
}