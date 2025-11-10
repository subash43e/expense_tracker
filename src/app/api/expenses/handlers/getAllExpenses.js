import { NextResponse } from "next/server";
import { getAllExpenses, getAllExpensesSimple } from "@lib/expenses";
import { handleApi, ensureAuthenticated } from "@lib/api/utils";

export async function handleGetAllExpenses(request) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);

    const { searchParams } = new URL(request.url);
    
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    const options = { userId };
    if (page) options.page = parseInt(page, 10);
    if (limit) options.limit = parseInt(limit, 10);
    if (category) options.category = category;
    if (sortBy) options.sortBy = sortBy;
    if (sortOrder) options.sortOrder = sortOrder;

    if (page || limit || category) {
      const result = await getAllExpenses(options);
      return NextResponse.json({ success: true, ...result });
    }

    const expenses = await getAllExpensesSimple(userId);
    return NextResponse.json({ success: true, data: expenses });
  }, { logMessage: "GET /api/expenses error" });
}
