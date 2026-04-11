"use client";

import { useRouter } from "next/navigation";
import { FaRegClock } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

export default function CandidateExamCard({ exam }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <h3 className="font-bold text-gray-900 mb-3 text-[15px] leading-snug">
        {exam.title}
      </h3>

      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <FaRegClock className="text-gray-400 text-base flex-shrink-0" />
          <span>
            Duration:{" "}
            <strong className="text-gray-900">{exam.duration} min</strong>
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <FiFileText className="text-gray-400 text-base flex-shrink-0" />
          <span>
            Question:{" "}
            <strong className="text-gray-900">
              {exam.question_count || 0}
            </strong>
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          <RxCross2 className="text-gray-400 text-base flex-shrink-0" />
          <span>
            Negative Marking:{" "}
            <strong className="text-gray-900">
              {exam.negative_marking ?? "-0.25"}/wrong
            </strong>
          </span>
        </span>
      </div>

      <button
        onClick={() => router.push(`/candidate/exam/${exam.id}`)}
        className="border border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-5 py-[7px] rounded-lg text-sm font-semibold transition-colors cursor-pointer"
      >
        Start
      </button>
    </div>
  );
}
