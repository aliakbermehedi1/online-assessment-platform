"use client";

import Link from "next/link";

export default function EmployerExamCard({ exam }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 mb-3 text-base leading-snug">
        {exam.title}
      </h3>
      <div className="flex items-center gap-5 text-sm text-gray-600 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span>👥</span>
          <span>
            Candidates: <strong>{exam.total_candidates || "Not Set"}</strong>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span>📄</span>
          <span>
            Question Set:{" "}
            <strong>{exam.total_question_sets || "Not Set"}</strong>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span>🕐</span>
          <span>
            Exam Slots: <strong>{exam.total_slots || "Not Set"}</strong>
          </span>
        </span>
      </div>
      <Link href={`/employer/tests/${exam.id}`}>
        <button className="border-2 border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          View Candidates
        </button>
      </Link>
    </div>
  );
}
