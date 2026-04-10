import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default sql;

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS employers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      ref_id VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      ref_id VARCHAR(50) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exams (
      id SERIAL PRIMARY KEY,
      employer_id INTEGER REFERENCES employers(id),
      title VARCHAR(255) NOT NULL,
      total_candidates INTEGER DEFAULT 0,
      total_slots INTEGER DEFAULT 0,
      total_question_sets INTEGER DEFAULT 0,
      question_type VARCHAR(50) DEFAULT 'MCQ',
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      duration INTEGER DEFAULT 30,
      negative_marking DECIMAL(4,2) DEFAULT -0.25,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      question_type VARCHAR(50) NOT NULL,
      score INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS options (
      id SERIAL PRIMARY KEY,
      question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
      option_text TEXT NOT NULL,
      is_correct BOOLEAN DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exam_submissions (
      id SERIAL PRIMARY KEY,
      exam_id INTEGER REFERENCES exams(id),
      candidate_id INTEGER REFERENCES candidates(id),
      answers JSONB DEFAULT '{}',
      submitted_at TIMESTAMP DEFAULT NOW(),
      is_timeout BOOLEAN DEFAULT FALSE
    )
  `;
}
