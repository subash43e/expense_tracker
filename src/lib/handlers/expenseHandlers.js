import { getExpenseById, updateExpense, deleteExpense } from "../expenses";
import { objectIdSchema, updateExpenseSchema } from "../validations";
import { ZodError } from "zod";

export async function fetchExpenseById(id) {
  objectIdSchema.parse(id);
  return getExpenseById(id);
}

export async function modifyExpense(id, data) {
  objectIdSchema.parse(id);
  const validatedData = updateExpenseSchema.parse(data);
  return updateExpense(id, validatedData);
}

export async function removeExpense(id) {
  objectIdSchema.parse(id);
  return deleteExpense(id);
}