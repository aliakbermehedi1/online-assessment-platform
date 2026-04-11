import sql from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "candidate") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exam_id, answers, is_timeout } = await request.json();

    const existing = await sql`
      SELECT id FROM exam_submissions 
      WHERE exam_id = ${exam_id} AND candidate_id = ${user.id}
    `;

    if (existing.length > 0) {
      await sql`
        UPDATE exam_submissions 
        SET answers = ${JSON.stringify(answers)}, is_timeout = ${is_timeout || false}, submitted_at = NOW()
        WHERE exam_id = ${exam_id} AND candidate_id = ${user.id}
      `;
    } else {
      await sql`
        INSERT INTO exam_submissions (exam_id, candidate_id, answers, is_timeout)
        VALUES (${exam_id}, ${user.id}, ${JSON.stringify(answers)}, ${is_timeout || false})
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
