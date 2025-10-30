import { z } from "zod";

// Validation schema for creating an expense
export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  amount: z
    .number()
    .positive("Amount must be a positive number")
    .min(0.01, "Amount must be at least 0.01"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  date: z
    .string()
    .datetime()
    .or(z.date())
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
});

// Validation schema for updating an expense
export const updateExpenseSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters")
    .optional(),
  amount: z
    .number()
    .positive("Amount must be a positive number")
    .min(0.01, "Amount must be at least 0.01")
    .optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters")
    .optional(),
  date: z
    .string()
    .datetime()
    .or(z.date())
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .optional(),
});

// Validation schema for query parameters
export const expenseQuerySchema = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.string().optional(),
  })
  .strip() // Remove any unknown properties
  .transform((val) => {
    // Transform string values to appropriate types
    return {
      page: val.page ? parseInt(val.page, 10) : undefined,
      limit: val.limit ? parseInt(val.limit, 10) : undefined,
      category: val.category || undefined,
      sortBy: val.sortBy || undefined,
      sortOrder: val.sortOrder || undefined,
    };
  })
  .refine(
    (data) => !data.page || data.page > 0,
    "Page must be a positive number"
  )
  .refine(
    (data) => !data.limit || (data.limit > 0 && data.limit <= 100),
    "Limit must be between 1 and 100"
  );

// Validation schema for MongoDB ObjectId
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid expense ID format");
