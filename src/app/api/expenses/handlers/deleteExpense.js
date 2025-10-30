import { removeExpense } from "@/lib/handlers/expenseHandlers";
import { objectIdSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";
import { ZodError } from "zod";
import { NextResponse } from "next/server";

export async function handleDeleteExpense(request, params) {
  try {
    // Check authentication
    const { userId, error } = requireAuth(request);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    // Validate ObjectId format
    objectIdSchema.parse(id);

    const expense = await removeExpense(id, userId);

    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", issues: error.errors },
        { status: 400 }
      );
    }
    console.error("DELETE /api/expenses/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}