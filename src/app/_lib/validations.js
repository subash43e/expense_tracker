import { z } from "zod";

const passwordRuleConfig = {
  length: {
    test: (password) => password.length >= 8,
    message: "Password must be at least 8 characters",
  },
  uppercase: {
    test: (password) => /[A-Z]/.test(password),
    message: "Password must contain at least one uppercase letter",
  },
  lowercase: {
    test: (password) => /[a-z]/.test(password),
    message: "Password must contain at least one lowercase letter",
  },
  number: {
    test: (password) => /[0-9]/.test(password),
    message: "Password must contain at least one number",
  },
  special: {
    test: (password) => /[!@#$%^&*]/.test(password),
    message: "Password must contain at least one special character (!@#$%^&*)",
  },
};

const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: passwordRuleConfig.length.message })
  .regex(/[A-Z]/, { message: passwordRuleConfig.uppercase.message })
  .regex(/[a-z]/, { message: passwordRuleConfig.lowercase.message })
  .regex(/[0-9]/, { message: passwordRuleConfig.number.message })
  .regex(/[!@#$%^&*]/, { message: passwordRuleConfig.special.message })
  .max(100, { message: "Password must be less than 100 characters" });

const amountSchema = z
  .union([
    z.number(),
    z.string().trim().min(1, { message: "Amount is required" }),
  ])
  .transform((val) => (typeof val === "string" ? Number(val) : val))
  .refine((val) => Number.isFinite(val), {
    message: "Amount must be a valid number",
  })
  .refine((val) => val > 0, {
    message: "Amount must be a positive number",
  })
  .refine((val) => val >= 0.01, {
    message: "Amount must be at least 0.01",
  })
  .refine((val) => val <= 1000000, {
    message: "Amount cannot exceed $1,000,000",
  });

const dateSchema = z
  .union([
    z.string().trim().min(1, { message: "Date is required" }),
    z.date(),
  ])
  .transform((val) => (typeof val === "string" ? new Date(val) : val))
  .refine((val) => !Number.isNaN(val.getTime()), {
    message: "Invalid date",
  });

export const createExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(200, { message: "Description must be less than 200 characters" }),
  amount: amountSchema,
  category: z
    .string()
    .trim()
    .min(2, { message: "Category must be at least 2 characters" })
    .max(50, { message: "Category must be less than 50 characters" }),
  date: dateSchema,
});

export const updateExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(200, { message: "Description must be less than 200 characters" })
    .optional(),
  amount: amountSchema.optional(),
  category: z
    .string()
    .trim()
    .min(2, { message: "Category must be at least 2 characters" })
    .max(50, { message: "Category must be less than 50 characters" })
    .optional(),
  date: dateSchema.optional(),
});

export const expenseQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  category: z.string().optional(),
});

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" });

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: passwordSchema,
});

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const createBudgetSchema = z.object({
  monthlyLimit: z
    .union([
      z.number(),
      z.string().trim().min(1, { message: "Monthly limit is required" }),
    ])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .refine((val) => Number.isFinite(val), {
      message: "Monthly limit must be a valid number",
    })
    .refine((val) => val >= 1, {
      message: "Monthly limit must be at least $1",
    })
    .refine((val) => val <= 10000000, {
      message: "Monthly limit cannot exceed $10,000,000",
    }),
  currency: z
    .string()
    .trim()
    .min(3, { message: "Currency must be at least 3 characters" })
    .max(3, { message: "Currency must be 3 characters (e.g., USD)" })
    .default("USD"),
});

export const updateBudgetSchema = z.object({
  monthlyLimit: z
    .union([
      z.number(),
      z.string().trim().min(1, { message: "Monthly limit is required" }),
    ])
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .refine((val) => Number.isFinite(val), {
      message: "Monthly limit must be a valid number",
    })
    .refine((val) => val > 0, {
      message: "Monthly limit must be a positive number",
    })
    .refine((val) => val >= 1, {
      message: "Monthly limit must be at least $1",
    })
    .refine((val) => val <= 10000000, {
      message: "Monthly limit cannot exceed $10,000,000",
    })
    .optional(),
  currency: z
    .string()
    .trim()
    .min(3, { message: "Currency must be at least 3 characters" })
    .max(3, { message: "Currency must be 3 characters (e.g., USD)" })
    .optional(),
});

export const formatZodErrors = (error) => {
  return error.issues.reduce((acc, issue) => {
    const [path] = issue.path;
    if (typeof path === "string" && !acc[path]) {
      acc[path] = issue.message;
    }
    return acc;
  }, {});
};

export const evaluatePasswordStrength = (password) => {
  const value = password || "";
  const requirements = Object.entries(passwordRuleConfig).reduce(
    (acc, [key, rule]) => ({ ...acc, [key]: rule.test(value) }),
    {}
  );

  const metRequirements = Object.values(requirements).filter(Boolean).length;

  let strength = "weak";
  if (metRequirements >= 5) {
    strength = "strong";
  } else if (metRequirements >= 3) {
    strength = "medium";
  }

  return { strength, requirements };
};