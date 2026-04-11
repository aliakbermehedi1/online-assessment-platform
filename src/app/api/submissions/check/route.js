import sql from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "candidate") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("exam_id");

    if (!examId) {
      return Response.json({ error: "exam_id required" }, { status: 400 });
    }

    const existing = await sql`
      SELECT id FROM exam_submissions
      WHERE exam_id = ${examId} AND candidate_id = ${user.id}
    `;

    return Response.json({ submitted: existing.length > 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
