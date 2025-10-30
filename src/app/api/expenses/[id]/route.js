import { NextResponse } from "next/server";
import { getExpenseById, updateExpense, deleteExpense } from "@/lib/expenses";
import { updateExpenseSchema, objectIdSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function GET(request, { params }) {
  try {
    // In Next.js 15+, params might be a promise
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // Validate ObjectId format
    objectIdSchema.parse(id);
    
    const expense = await getExpenseById(id);
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
    console.error("GET /api/expenses/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // In Next.js 15+, params might be a promise
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // Validate ObjectId format
    objectIdSchema.parse(id);
    
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateExpenseSchema.parse(body);
    
    const expense = await updateExpense(id, validatedData);
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

export async function DELETE(request, { params }) {
  try {
    // In Next.js 15+, params might be a promise
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    // Validate ObjectId format
    objectIdSchema.parse(id);
    
    const expense = await deleteExpense(id);
    
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
