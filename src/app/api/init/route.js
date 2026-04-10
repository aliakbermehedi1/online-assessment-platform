import { initDB } from "@/lib/db";

export async function GET() {
  try {
    await initDB();
    return Response.json({ message: "Database initialized successfully!" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
