"use client";

import { useRouter } from "next/navigation";

export default function CandidateExamCard({ exam }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 mb-3 text-base">
        {exam.title}
      </h3>
      <div className="flex items-center gap-5 text-sm text-gray-600 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span>🕐</span>
          <span>
            Duration: <strong>{exam.duration} min</strong>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span>📄</span>
          <span>
            Question: <strong>{exam.question_count || 0}</strong>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span>✖</span>
          <span>
            Negative Marking: <strong>{exam.negative_marking}/wrong</strong>
          </span>
        </span>
      </div>
      <button
        onClick={() => router.push(`/candidate/exam/${exam.id}`)}
        className="border-2 border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        Start
      </button>
    </div>
  );
}
