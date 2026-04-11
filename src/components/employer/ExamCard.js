"use client";

import Link from "next/link";

// ─── Font Awesome Icons as JSX Components ──────────────────────────────────
// Font Awesome CSS is already loaded in your Navbar/Footer via:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

const CandidatesIcon = () => (
  <i className="fa-solid fa-users text-gray-400 text-[15px]" />
);

const QuestionSetIcon = () => (
  <i className="fa-regular fa-file-lines text-gray-400 text-[15px]" />
);

const ExamSlotsIcon = () => (
  <i className="fa-regular fa-clock text-gray-400 text-[15px]" />
);

// ─── Main Card Component ────────────────────────────────────────────────────

export default function EmployerExamCard({ exam }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      {/* Title */}
      <h3 className="font-bold text-gray-900 mb-3 text-[15px] leading-snug">
        {exam.title}
      </h3>

      {/* Stats Row */}
      <div className="flex items-center gap-10 text-sm text-gray-500 mb-4 flex-wrap">
        {/* Candidates */}
        <span className="flex items-center gap-1.5">
          <CandidatesIcon />
          <span>
            Candidates:{" "}
            <strong className="text-gray-900 font-bold">
              {exam.total_candidates ?? "Not Set"}
            </strong>
          </span>
        </span>

        {/* Question Set */}
        <span className="flex items-center gap-1.5">
          <QuestionSetIcon />
          <span>
            Question Set:{" "}
            <strong className="text-gray-900 font-bold">
              {exam.total_question_sets ?? "Not Set"}
            </strong>
          </span>
        </span>

        {/* Exam Slots */}
        <span className="flex items-center gap-1.5">
          <ExamSlotsIcon />
          <span>
            Exam Slots:{" "}
            <strong className="text-gray-900 font-bold">
              {exam.total_slots ?? "Not Set"}
            </strong>
          </span>
        </span>
      </div>

      {/* View Candidates Button */}
      <Link href={`/employer/tests/${exam.id}`}>
        <button className="border border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-5 py-[7px] rounded-lg text-sm font-semibold transition-colors cursor-pointer">
          View Candidates
        </button>
      </Link>
    </div>
  );
}
