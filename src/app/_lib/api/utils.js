import { NextResponse } from "next/server";
import { ZodError } from "zod";
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const SECRET_KEY = process.env.JWT_SECRET;

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export  function ensureAuthenticated(request) {
  try {
    const token = request.cookies?.get("token")?.value;
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;
    return userId;
  } catch (err) {
    if (err) {
      throw new ApiError(401, `Unauthorized ${err}`);
    }
  }
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
