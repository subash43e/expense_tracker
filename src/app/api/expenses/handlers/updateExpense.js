import { NextResponse } from "next/server";
import { modifyExpense } from "@/lib/handlers/expenseHandlers";
import { updateExpenseSchema } from "@/lib/validations";
import {
  ApiError,
  ensureAuthenticated,
  handleApi,
  resolveAndValidateObjectId,
} from "@/lib/api/utils";
import { validateCsrfToken } from "@/lib/security/csrf";

export async function handleUpdateExpense(request, params) {
  return handleApi(async () => {
    validateCsrfToken(request);
    const userId = ensureAuthenticated(request);
    const id = await resolveAndValidateObjectId(params);

    const body = await request.json();
    const validatedData = updateExpenseSchema.parse(body);

    const expense = await modifyExpense(id, userId, validatedData);
    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }
    return NextResponse.json({ success: true, data: expense });
  }, { logMessage: "PUT /api/expenses/[id] error" });
}