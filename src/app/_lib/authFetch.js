function normalizeHeaders(headersInit = {}) {
  if (headersInit instanceof Headers) {
    return Object.fromEntries(headersInit.entries());
  }
  return { ...headersInit };
}

export async function authFetch(url, options = {}) {
  const headers = normalizeHeaders(options.headers);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    const event = new CustomEvent("auth:unauthorized");
    window.dispatchEvent(event);
  }

  return response;
}
