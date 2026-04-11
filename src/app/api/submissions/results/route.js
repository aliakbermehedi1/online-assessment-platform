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
    if (!user || user.role !== "employer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("exam_id");

    if (!examId) {
      return Response.json({ error: "exam_id required" }, { status: 400 });
    }

    // Make sure this exam belongs to this employer
    const examCheck = await sql`
      SELECT id FROM exams WHERE id = ${examId} AND employer_id = ${user.id}
    `;
    if (examCheck.length === 0) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await sql`
      SELECT 
        es.id,
        es.exam_id,
        es.candidate_id,
        es.answers,
        es.is_timeout,
        es.submitted_at,
        c.name as candidate_name,
        c.email as candidate_email,
        c.ref_id
      FROM exam_submissions es
      JOIN candidates c ON c.id = es.candidate_id
      WHERE es.exam_id = ${examId}
      ORDER BY es.submitted_at DESC
    `;

    return Response.json({ submissions });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
