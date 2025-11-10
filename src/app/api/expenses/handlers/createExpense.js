import { NextResponse } from "next/server";
import { createExpense } from "@lib/expenses";
import { createExpenseSchema } from "@lib/validations";
import { handleApi, ensureAuthenticated } from "@lib/api/utils";

export async function handleCreateExpense(request) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);

    const body = await request.json();
    
    const validatedData = createExpenseSchema.parse(body);
    
    const expenseData = { ...validatedData, userId };
    
    const expense = await createExpense(expenseData);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  }, { logMessage: "POST /api/expenses error" });
}
