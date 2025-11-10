import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Public Layout - Handles public routes like login and register
 * Redirects authenticated users to home page
 * 
 * Routes in this group:
 * - /login
 * - /register
 */
export default async function PublicLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // If already authenticated, redirect to home
  if (token) {
    redirect('/');
  }

  // Not authenticated, render public pages
  return <>{children}</>;
}
