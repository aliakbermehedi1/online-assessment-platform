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
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("exam_id");
    if (!examId)
      return Response.json({ error: "exam_id required" }, { status: 400 });

    const questions = await sql`
      SELECT q.*, 
        json_agg(
          json_build_object(
            'id', o.id,
            'option_text', o.option_text,
            'is_correct', o.is_correct
          ) ORDER BY o.id
        ) FILTER (WHERE o.id IS NOT NULL) as options
      FROM questions q
      LEFT JOIN options o ON o.question_id = q.id
      WHERE q.exam_id = ${examId}
      GROUP BY q.id
      ORDER BY q.created_at ASC
    `;

    return Response.json({ questions });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "employer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { exam_id, question_text, question_type, score, options } = body;

    const qResult = await sql`
      INSERT INTO questions (exam_id, question_text, question_type, score)
      VALUES (${exam_id}, ${question_text}, ${question_type}, ${score || 1})
      RETURNING *
    `;

    const question = qResult[0];

    if (options && options.length > 0) {
      for (const opt of options) {
        await sql`
          INSERT INTO options (question_id, option_text, is_correct)
          VALUES (${question.id}, ${opt.option_text}, ${opt.is_correct || false})
        `;
      }
    }

    const full = await sql`
      SELECT q.*, 
        json_agg(
          json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct)
          ORDER BY o.id
        ) FILTER (WHERE o.id IS NOT NULL) as options
      FROM questions q
      LEFT JOIN options o ON o.question_id = q.id
      WHERE q.id = ${question.id}
      GROUP BY q.id
    `;

    return Response.json({ question: full[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "employer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, question_text, question_type, score, options } = body;

    await sql`
      UPDATE questions SET question_text = ${question_text}, question_type = ${question_type}, score = ${score}
      WHERE id = ${id}
    `;

    await sql`DELETE FROM options WHERE question_id = ${id}`;

    if (options && options.length > 0) {
      for (const opt of options) {
        await sql`
          INSERT INTO options (question_id, option_text, is_correct)
          VALUES (${id}, ${opt.option_text}, ${opt.is_correct || false})
        `;
      }
    }

    const full = await sql`
      SELECT q.*, 
        json_agg(
          json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct)
          ORDER BY o.id
        ) FILTER (WHERE o.id IS NOT NULL) as options
      FROM questions q
      LEFT JOIN options o ON o.question_id = q.id
      WHERE q.id = ${id}
      GROUP BY q.id
    `;

    return Response.json({ question: full[0] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "employer") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await sql`DELETE FROM questions WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
