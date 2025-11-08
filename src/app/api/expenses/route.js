import { handleGetAllExpenses } from "./handlers/getAllExpenses";
import { handleCreateExpense } from "./handlers/createExpense";

export async function GET(request) {
  return handleGetAllExpenses(request);
}

export async function POST(request) {
  return handleCreateExpense(request);
}
