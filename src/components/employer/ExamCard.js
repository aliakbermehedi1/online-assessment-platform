"use client";

import Link from "next/link";

export default function EmployerExamCard({ exam }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <h3 className="font-bold text-gray-900 mb-4 text-base leading-snug">
          {exam.title}
        </h3>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-5">
          {/* Candidates */}
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-user text-gray-500 text-base"></i>
            <span>
              Candidates:{" "}
              <strong className="text-gray-900">
                {exam.total_candidates || "Not Set"}
              </strong>
            </span>
          </span>

          {/* Question Set */}
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-file-lines text-gray-500 text-base"></i>
            <span>
              Question Set:{" "}
              <strong className="text-gray-900">
                {exam.total_question_sets || "Not Set"}
              </strong>
            </span>
          </span>

          {/* Exam Slots */}
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-clock text-gray-500 text-base"></i>
            <span>
              Exam Slots:{" "}
              <strong className="text-gray-900">
                {exam.total_slots || "Not Set"}
              </strong>
            </span>
          </span>
        </div>

        <Link href={`/employer/tests/${exam.id}`}>
          <button className="border-2 border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
            View Candidates
          </button>
        </Link>
      </div>
    </>
  );
}
