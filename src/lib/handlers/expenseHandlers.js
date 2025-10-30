import { getExpenseById, updateExpense, deleteExpense } from "../expenses";
import { objectIdSchema, updateExpenseSchema } from "../validations";
import { ZodError } from "zod";

export async function fetchExpenseById(id, userId) {
  objectIdSchema.parse(id);
  return getExpenseById(id, userId);
}

export async function modifyExpense(id, userId, data) {
  objectIdSchema.parse(id);
  const validatedData = updateExpenseSchema.parse(data);
  return updateExpense(id, userId, validatedData);
}

export async function removeExpense(id, userId) {
  objectIdSchema.parse(id);
  return deleteExpense(id, userId);
}