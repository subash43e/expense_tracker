import { NextResponse } from "next/server";
import { handleGetExpenseById } from "../handlers/getExpenseById";
import { handleUpdateExpense } from "../handlers/updateExpense";
import { handleDeleteExpense } from "../handlers/deleteExpense";

export async function GET(request, context) {
  const params = await context.params;
  return handleGetExpenseById(request, params);
}

export async function PUT(request, context) {
  const params = await context.params;
  return handleUpdateExpense(request, params);
}

export async function DELETE(request, context) {
  const params = await context.params;
  return handleDeleteExpense(request, params);
}
