import sql from "@/lib/db";
import { hashPassword, generateRefId } from "@/lib/auth";

export async function GET() {
  try {
    const employerPassword = await hashPassword("employer123");
    const candidatePassword = await hashPassword("candidate123");

    await sql`
      INSERT INTO employers (name, email, password, ref_id)
      VALUES ('Ali Akber Mehedi', 'employer@ibos.com', ${employerPassword}, ${generateRefId()})
      ON CONFLICT (email) DO NOTHING
    `;

    await sql`
      INSERT INTO candidates (name, email, password, ref_id)
      VALUES ('Sayed Hasan', 'candidate@ibos.com', ${candidatePassword}, ${generateRefId()})
      ON CONFLICT (email) DO NOTHING
    `;

    return Response.json({
      message: "Seed data created!",
      credentials: {
        employer: { email: "employer@ibos.com", password: "employer123" },
        candidate: { email: "candidate@ibos.com", password: "candidate123" },
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
