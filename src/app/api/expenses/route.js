import { NextResponse } from "next/server";
import { getAllExpenses, getAllExpensesSimple, createExpense } from "@/lib/expenses";
import { createExpenseSchema } from "@/lib/validations";
import { handleApi, ensureAuthenticated } from "@/lib/api/utils";

export async function GET(request) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);

    // Check if pagination is requested via query params
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    // Build options object for getAllExpenses
    const options = { userId };
    if (page) options.page = parseInt(page, 10);
    if (limit) options.limit = parseInt(limit, 10);
    if (category) options.category = category;
    if (sortBy) options.sortBy = sortBy;
    if (sortOrder) options.sortOrder = sortOrder;

    // Use paginated version if params are provided
    if (page || limit || category) {
      const result = await getAllExpenses(options);
      return NextResponse.json({ success: true, ...result });
    }

    // Otherwise use simple version for backward compatibility
    const expenses = await getAllExpensesSimple(userId);
    return NextResponse.json({ success: true, data: expenses });
  }, { logMessage: "GET /api/expenses error" });
}

export async function POST(request) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);

    const body = await request.json();
    
    // Validate request body
    const validatedData = createExpenseSchema.parse(body);
    
    // Add userId to the expense data
    const expenseData = { ...validatedData, userId };
    
    const expense = await createExpense(expenseData);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  }, { logMessage: "POST /api/expenses error" });
}
