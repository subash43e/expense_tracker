import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAuth } from "@/lib/auth";
import { objectIdSchema } from "@/lib/validations";

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function ensureAuthenticated(request) {
  const { userId, error } = requireAuth(request);
  if (error) {
    throw new ApiError(error.status ?? 401, error.message);
  }
  return userId;
}

export async function resolveAndValidateObjectId(params) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;
  objectIdSchema.parse(id);
  return id;
}

export async function handleApi(handler, { logMessage } = {}) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      const payload = { success: false, error: error.message };
      if (error.details && typeof error.details === "object") {
        Object.assign(payload, error.details);
      }
      return NextResponse.json(payload, { status: error.status });
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", issues: error.errors },
        { status: 400 }
      );
    }

    if (logMessage) {
      console.error(`${logMessage}:`, error);
    } else {
      console.error("API handler error:", error);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
