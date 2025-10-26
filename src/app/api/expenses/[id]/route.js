
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export async function GET(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  await dbConnect();
  try {
    const expense = await Expense.findById(params.id);
    if (!expense) {
      return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  await dbConnect();
  try {
    const body = await request.json();
    const expense = await Expense.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!expense) {
      return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  await dbConnect();
  try {
    const deletedExpense = await Expense.deleteOne({ _id: params.id });
    if (deletedExpense.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
