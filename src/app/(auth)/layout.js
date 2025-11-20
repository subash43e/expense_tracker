import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function AuthLayout({ children }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('jwt-login');

  if (!token) {
    redirect('/login');
  }

  // Token exists, render the protected content
  return <>{children}</>;
}
