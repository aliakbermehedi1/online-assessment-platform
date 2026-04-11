import sql from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request, { params }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "employer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const result = await sql`
      SELECT * FROM exams WHERE id = ${id} AND employer_id = ${user.id}
    `;

    if (result.length === 0) {
      return Response.json({ error: "Exam not found" }, { status: 404 });
    }

    return Response.json({ exam: result[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "employer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const examCheck = await sql`
      SELECT id FROM exams WHERE id = ${id} AND employer_id = ${user.id}
    `;
    if (examCheck.length === 0) {
      return Response.json(
        { error: "Exam not found or unauthorized" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const {
      title,
      total_candidates,
      total_slots,
      total_question_sets,
      question_type,
      start_time,
      end_time,
      duration,
    } = body;

    if (!duration || duration <= 0) {
      return Response.json(
        { error: "Duration is required and must be positive" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE exams SET
        title = ${title},
        total_candidates = ${total_candidates},
        total_slots = ${total_slots},
        total_question_sets = ${total_question_sets},
        question_type = ${question_type},
        start_time = ${start_time || null},
        end_time = ${end_time || null},
        duration = ${duration}
      WHERE id = ${id} AND employer_id = ${user.id}
      RETURNING *
    `;

    return Response.json({ exam: result[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
