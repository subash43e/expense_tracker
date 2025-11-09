import { NextResponse } from "next/server";
import { handleApi, ensureAuthenticated } from "@/lib/api/utils";
import { validateCsrfToken } from "@/lib/security/csrf";
import { deleteBudget } from "@/lib/budgets";

/**
 * DELETE handler to delete the user's budget.
 */
export async function handleDeleteBudget(request) {
  return handleApi(
    async () => {
      await validateCsrfToken(request);
      const userId = ensureAuthenticated(request);

      await deleteBudget(userId);

      return NextResponse.json(
        { success: true, message: "Budget deleted successfully" },
        { status: 200 }
      );
    },
    { logMessage: "Error deleting budget" }
  );
}
