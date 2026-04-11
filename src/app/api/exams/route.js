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
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const offset = (page - 1) * limit;

    let exams, countResult;

    if (user.role === "employer") {
      exams = await sql`
        SELECT e.*, 
          COUNT(DISTINCT q.id) as question_count,
          COUNT(DISTINCT es.id) as submission_count
        FROM exams e
        LEFT JOIN questions q ON q.exam_id = e.id
        LEFT JOIN exam_submissions es ON es.exam_id = e.id
        WHERE e.employer_id = ${user.id}
        AND e.title ILIKE ${"%" + search + "%"}
        GROUP BY e.id
        ORDER BY e.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*) FROM exams 
        WHERE employer_id = ${user.id}
        AND title ILIKE ${"%" + search + "%"}
      `;
    } else {
      // Candidates only see exams within their time window
      // Show: upcoming (start in future), active (now between start and end),
      // Expired exams still shown but card will show "Expired" - handled on frontend
      exams = await sql`
        SELECT e.*,
          COUNT(DISTINCT q.id) as question_count
        FROM exams e
        LEFT JOIN questions q ON q.exam_id = e.id
        WHERE e.title ILIKE ${"%" + search + "%"}
        AND (
          e.end_time IS NULL 
          OR e.end_time > NOW() - INTERVAL '1 day'
        )
        GROUP BY e.id
        ORDER BY e.start_time ASC NULLS LAST, e.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*) FROM exams
        WHERE title ILIKE ${"%" + search + "%"}
        AND (
          e.end_time IS NULL 
          OR e.end_time > NOW() - INTERVAL '1 day'
        )
      `;
    }

    return Response.json({
      exams,
      totalCount: parseInt(countResult[0].count),
      page,
      limit,
    });
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
      INSERT INTO exams (employer_id, title, total_candidates, total_slots, total_question_sets, question_type, start_time, end_time, duration)
      VALUES (${user.id}, ${title}, ${total_candidates}, ${total_slots}, ${total_question_sets}, ${question_type}, ${start_time}, ${end_time}, ${duration})
      RETURNING *
    `;

    return Response.json({ exam: result[0] }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
