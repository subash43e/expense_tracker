import { NextResponse } from "next/server";
import { handleGetExpenseById } from "../handlers/getExpenseById";
import { handleUpdateExpense } from "../handlers/updateExpense";
import { handleDeleteExpense } from "../handlers/deleteExpense";

export async function GET(request, { params }) {
  return handleGetExpenseById(params);
}

export async function PUT(request, { params }) {
  return handleUpdateExpense(request, params);
}

export async function DELETE(request, { params }) {
  return handleDeleteExpense(params);
}
