import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const SECRET_KEY = process.env.JWT_SECRET;

export function getUserIdFromRequest(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return null;
    }

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
