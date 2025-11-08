const CSRF_COOKIE_NAME = "csrfToken";
export const CSRF_HEADER_NAME = "x-csrf-token";

let csrfTokenPromise = null;

function normalizeHeaders(headersInit = {}) {
  if (headersInit instanceof Headers) {
    return Object.fromEntries(headersInit.entries());
  }
  return { ...headersInit };
}

export function getAuthHeaders() {
  const token =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("expenseTrackerToken");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getCsrfToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export async function ensureCsrfToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const existingToken = getCsrfToken();
  if (existingToken) {
    return existingToken;
  }

  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          console.warn(
            "CSRF token endpoint returned",
            response.status,
            response.statusText
          );
          return null;
        }
        const data = await response.json();
        return data.token ?? null;
      })
      .catch((error) => {
        console.warn("CSRF token fetch failed:", error);
        return null;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
}

export function withCsrfHeader(headersInit = {}) {
  const headers = normalizeHeaders(headersInit);
  const token = getCsrfToken();
  if (token) {
    headers[CSRF_HEADER_NAME] = token;
  }
  return headers;
}

export async function authFetch(url, options = {}) {
  await ensureCsrfToken();

  const headers = withCsrfHeader({
    ...getAuthHeaders(),
    ...normalizeHeaders(options.headers),
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    window.localStorage.removeItem("expenseTrackerToken");
    const event = new CustomEvent("auth:unauthorized");
    window.dispatchEvent(event);
  }

  return response;
}
