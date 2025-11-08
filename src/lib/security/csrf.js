import crypto from "crypto";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/utils";

export const CSRF_COOKIE_NAME = "csrfToken";
export const CSRF_HEADER_NAME = "x-csrf-token";

const isProd = process.env.NODE_ENV === "production";

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function setCsrfCookie(response, token) {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: false,
    sameSite: "strict",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60,
  });
}

export function validateCsrfToken(request) {
  const headerToken = request.headers.get(CSRF_HEADER_NAME) ?? "";
  let cookieToken = "";
  // In Next.js route handlers the request may carry cookies on the request object
  // (RequestCookies) with .get(), otherwise fall back to the next/headers cookies().
  try {
    if (request && request.cookies && typeof request.cookies.get === "function") {
      cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value ?? "";
    } else {
      cookieToken = cookies().get(CSRF_COOKIE_NAME)?.value ?? "";
    }
  } catch (err) {
    // If cookie access fails, treat as missing token
    cookieToken = "";
  }

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    throw new ApiError(403, "Invalid CSRF token");
  }
}

export function clearCsrfCookie(response) {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: "",
    httpOnly: false,
    sameSite: "strict",
    secure: isProd,
    path: "/",
    maxAge: 0,
  });
}
