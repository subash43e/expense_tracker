import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const SECRET_KEY = process.env.JWT_SECRET;

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
