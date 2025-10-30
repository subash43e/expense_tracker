import { NextResponse } from "next/server";
import { getAllExpenses, getAllExpensesSimple, createExpense } from "@/lib/expenses";
import { createExpenseSchema, expenseQuerySchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";
import { ZodError } from "zod";

export async function GET(request) {
  try {
    // Check authentication
    const { userId, error } = requireAuth(request);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    // Check if pagination is requested via query params
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    console.log("Incoming query parameters:", { page, limit, category, sortBy, sortOrder });

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
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check authentication
    const { userId, error } = requireAuth(request);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedData = createExpenseSchema.parse(body);
    
    // Add userId to the expense data
    const expenseData = { ...validatedData, userId };
    
    const expense = await createExpense(expenseData);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", issues: error.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
