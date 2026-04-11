"use client";

import Link from "next/link";
import { FaUsers } from "react-icons/fa";
import { FaRegFileLines, FaRegClock } from "react-icons/fa6";

export default function EmployerExamCard({ exam }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow">
      <h3 className="font-bold text-gray-900 mb-3 text-[15px] leading-snug">
        {exam.title}
      </h3>

      <div className="flex items-center gap-8 text-sm text-gray-500 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <FaUsers className="text-gray-400 text-base" />
          <span>
            Candidates:{" "}
            <strong className="text-gray-900">
              {exam.total_candidates ?? "Not Set"}
            </strong>
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <FaRegFileLines className="text-gray-400 text-base" />
          <span>
            Question Set:{" "}
            <strong className="text-gray-900">
              {exam.total_question_sets ?? "Not Set"}
            </strong>
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <FaRegClock className="text-gray-400 text-base" />
          <span>
            Exam Slots:{" "}
            <strong className="text-gray-900">
              {exam.total_slots ?? "Not Set"}
            </strong>
          </span>
        </span>
      </div>

      <Link href={`/employer/tests/${exam.id}`}>
        <button className="border border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-5 py-[7px] rounded-lg text-sm font-semibold transition-colors cursor-pointer">
          View Candidates
        </button>
      </Link>
    </div>
  );
}
