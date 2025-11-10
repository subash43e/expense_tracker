import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Auth Layout - Automatically protects all routes in the (auth) route group
 * Runs on the server before rendering to check authentication
 * If no token is found, redirects to login page
 * 
 * Routes protected by this layout:
 * - /expenses
 * - /analytics
 * - /settings
 */
export default async function AuthLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // If no token, redirect to login
  if (!token) {
    redirect('/login');
  }

  // Token exists, render the protected content
  return <>{children}</>;
}
