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

  const now = new Date();
  const startTime = exam.start_time ? new Date(exam.start_time) : null;
  const endTime = exam.end_time ? new Date(exam.end_time) : null;
  const isExpired = endTime && now > endTime;
  const isUpcoming = startTime && now < startTime;

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

  function formatDateTime(dt) {
    if (!dt) return null;
    return new Date(dt).toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleStart = () => {
    if (submitted || isExpired || isUpcoming) return;
    router.push(`/candidate/exam/${exam.id}`);
  };

  const getButtonContent = () => {
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
          "bg-green-50 border border-green-300 text-green-700 cursor-not-allowed",
        disabled: true,
      };
    if (isExpired)
      return {
        label: "Expired",
        style:
          "bg-red-50 border border-red-200 text-red-500 cursor-not-allowed",
        disabled: true,
      };
    if (isUpcoming)
      return {
        label: "Upcoming",
        style:
          "bg-yellow-50 border border-yellow-200 text-yellow-600 cursor-not-allowed",
        disabled: true,
      };
    return {
      label: "Start",
      style:
        "border border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 cursor-pointer",
      disabled: false,
    };
  };

  const btn = getButtonContent();

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-shadow ${isExpired ? "border-gray-100 opacity-70" : submitted ? "border-green-100" : "border-gray-200 hover:shadow-sm"}`}
    >
      <h3 className="font-bold text-gray-900 mb-3 text-[15px] leading-snug">
        {exam.title}
      </h3>

      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3 flex-wrap">
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

      {/* Time window */}
      {(startTime || endTime) && (
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 flex-wrap">
          {startTime && (
            <span>
              Start:{" "}
              <span className="text-gray-600 font-medium">
                {formatDateTime(exam.start_time)}
              </span>
            </span>
          )}
          {endTime && (
            <span>
              End:{" "}
              <span className="text-gray-600 font-medium">
                {formatDateTime(exam.end_time)}
              </span>
            </span>
          )}
        </div>
      )}

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
