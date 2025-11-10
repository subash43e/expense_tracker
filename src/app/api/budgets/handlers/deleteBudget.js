import { NextResponse } from "next/server";
import { handleApi, ensureAuthenticated } from "@/lib/api/utils";
import { deleteBudget } from "@/lib/budgets";

export async function handleDeleteBudget(request) {
  return handleApi(
    async () => {
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
