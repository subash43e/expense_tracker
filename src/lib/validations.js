import { z } from "zod";

/**
 * Validation schema for creating an expense.
 */
export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(200, { message: "Description must be less than 200 characters" }),
  amount: z
    .number()
    .positive({ message: "Amount must be a positive number" })
    .min(0.01, { message: "Amount must be at least 0.01" }),
  category: z
    .string()
    .min(1, { message: "Category is required" })
    .max(50, { message: "Category must be less than 50 characters" }),
  date: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
});

/**
 * Validation schema for updating an expense.
 */
export const updateExpenseSchema = z.object({
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(200, { message: "Description must be less than 200 characters" })
    .optional(),
  amount: z
    .number()
    .positive({ message: "Amount must be a positive number" })
    .min(0.01, { message: "Amount must be at least 0.01" })
    .optional(),
  category: z
    .string()
    .min(1, { message: "Category is required" })
    .max(50, { message: "Category must be less than 50 characters" })
    .optional(),
  date: z
    .union([z.string().datetime(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),
});

/**
 * Validation schema for query parameters.
 */
export const expenseQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  category: z.string().optional(),
});

/**
 * Validation schema for MongoDB ObjectId.
 */
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" });