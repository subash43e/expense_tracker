import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function PublicLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt-login")?.value;
  const SECRET_KEY = process.env.JWT_SECRET;

  const decoded = token ? jwt.verify(token, SECRET_KEY) : null;
  if (token) {
    redirect("/");
  }

  // Not authenticated, render public pages
  return <>{children}</>;
}
