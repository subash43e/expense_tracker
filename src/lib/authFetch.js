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

export async function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...normalizeHeaders(options.headers),
  };

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
