import { NextResponse } from "next/server";
import { handleApi, ensureAuthenticated } from "@/lib/api/utils";
import { validateCsrfToken } from "@/lib/security/csrf";
import { upsertBudget } from "@/lib/budgets";
import { createBudgetSchema } from "@/lib/validations";

export async function handleUpsertBudget(request) {
  return handleApi(
    async () => {
      await validateCsrfToken(request);
      const userId = ensureAuthenticated(request);

      const body = await request.json();
      const validatedData = createBudgetSchema.parse(body);

      const budget = await upsertBudget(userId, validatedData);

      return NextResponse.json(
        { success: true, budget, message: "Budget saved successfully" },
        { status: 200 }
      );
    },
    { logMessage: "Error upserting budget" }
  );
}
