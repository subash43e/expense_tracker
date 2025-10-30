/**
 * Get authorization headers with JWT token
 * @returns {Object} Headers object with Authorization
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('expenseTrackerToken');
  
  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Authenticated fetch wrapper
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('expenseTrackerToken');
    const event = new CustomEvent('auth:unauthorized');
    window.dispatchEvent(event);
  }

  return response;
}
