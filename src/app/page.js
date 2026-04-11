import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role === "employer") {
        redirect("/employer/dashboard");
      } else if (payload.role === "candidate") {
        redirect("/candidate/dashboard");
      }
    } catch {
      // token invalid, show login selector
    }
  }

  redirect("/login");
}
