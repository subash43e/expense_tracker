import { handleGetBudget } from "./handlers/getBudget";
import { handleUpsertBudget } from "./handlers/upsertBudget";
import { handleDeleteBudget } from "./handlers/deleteBudget";

export async function GET(request) {
  return handleGetBudget(request);
}

export async function POST(request) {
  return handleUpsertBudget(request);
}

export async function DELETE(request) {
  return handleDeleteBudget(request);
}
