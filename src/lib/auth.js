import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

/**
 * Extract and verify user ID from authorization header
 * @param {Request} request - Next.js request object
 * @returns {string|null} - User ID if valid token, null otherwise
 */
export function getUserIdFromRequest(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Middleware to check if user is authenticated
 * @param {Request} request - Next.js request object
 * @returns {Object} - { userId, error } object
 */
export function requireAuth(request) {
  const userId = getUserIdFromRequest(request);
  
  if (!userId) {
    return {
      userId: null,
      error: { message: 'Unauthorized', status: 401 }
    };
  }

  return { userId, error: null };
}
