"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaRegFileLines, FaRegClock } from "react-icons/fa6";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function EmployerExamCard({ exam, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/exams?id=${exam.id}`, { method: "DELETE" });
      if (res.ok) {
        setShowDeleteModal(false);
        onDelete?.(exam.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        className="relative bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Edit icon — top right, on hover */}
        <Link href={`/employer/tests/${exam.id}/edit`}>
          <button
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-[#6B3FE7] hover:border-[#6B3FE7] hover:bg-purple-50 transition-all duration-200 ${
              hovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90 pointer-events-none"
            }`}
            title="Edit exam"
            onClick={(e) => e.stopPropagation()}
          >
            <FiEdit2 className="text-sm" />
          </button>
        </Link>

        <h3 className="font-bold text-gray-900 mb-3 text-[15px] leading-snug pr-8">
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

        {/* Bottom row: View Candidates + Delete icon */}
        <div className="flex items-center justify-between">
          <Link href={`/employer/tests/${exam.id}`}>
            <button className="border border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 px-5 py-[7px] rounded-lg text-sm font-semibold transition-colors cursor-pointer">
              View Candidates
            </button>
          </Link>

          {/* Delete icon — bottom right, on hover */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50 transition-all duration-200 ${
              hovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90 pointer-events-none"
            }`}
            title="Delete exam"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 z-10 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <FiTrash2 className="text-red-500 text-xl" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Delete Exam?
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                Are you sure you want to delete
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-5">
                &ldquo;{exam.title}&rdquo;?
              </p>
              <p className="text-xs text-red-400 mb-6">
                This action cannot be undone. All questions and submissions will
                also be deleted.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
