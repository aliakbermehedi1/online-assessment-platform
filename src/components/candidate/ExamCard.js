"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa6";
import { FiFileText } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

export default function CandidateExamCard({ exam }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(`/api/submissions/check?exam_id=${exam.id}`);
        const data = await res.json();
        setSubmitted(data.submitted);
      } catch {
        // ignore
      } finally {
        setCheckingStatus(false);
      }
    }
    checkStatus();
  }, [exam.id]);

  const handleStart = () => {
    if (submitted) return;
    router.push(`/candidate/exam/${exam.id}`);
  };

  const getButton = () => {
    if (checkingStatus)
      return {
        label: "...",
        style: "border border-gray-200 text-gray-400 cursor-not-allowed",
        disabled: true,
      };
    if (submitted)
      return {
        label: "Submitted",
        style:
          "bg-green-50 border border-green-300 text-green-700 cursor-not-allowed font-semibold",
        disabled: true,
      };
    return {
      label: "Start",
      style:
        "border border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 cursor-pointer",
      disabled: false,
    };
  };

  const btn = getButton();

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-shadow ${submitted ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:shadow-sm"}`}
    >
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
        onClick={handleStart}
        disabled={btn.disabled}
        className={`px-5 py-[7px] rounded-lg text-sm font-semibold transition-colors ${btn.style}`}
      >
        {btn.label}
      </button>
    </div>
  );
}
