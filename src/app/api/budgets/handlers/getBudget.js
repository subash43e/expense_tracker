import { NextResponse } from "next/server";
import { handleApi, ensureAuthenticated } from "@/lib/api/utils";
import { getBudgetByUserId } from "@/lib/budgets";

/**
 * GET handler to retrieve the user's budget.
 */
export async function handleGetBudget(request) {
  return handleApi(
    async () => {
      const userId = ensureAuthenticated(request);
      const budget = await getBudgetByUserId(userId);

      if (!budget) {
        return NextResponse.json(
          { success: true, budget: null },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { success: true, budget },
        { status: 200 }
      );
    },
    { logMessage: "Error fetching budget" }
  );
}
