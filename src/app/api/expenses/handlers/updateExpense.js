import { modifyExpense } from "@/lib/handlers/expenseHandlers";
import { objectIdSchema } from "@/lib/validations";
import { ZodError } from "zod";
import { NextResponse } from "next/server";

export async function handleUpdateExpense(request, params) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    // Validate ObjectId format
    objectIdSchema.parse(id);

    const body = await request.json();

    const expense = await modifyExpense(id, body);
    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", issues: error.errors },
        { status: 400 }
      );
    }
    console.error("PUT /api/expenses/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}