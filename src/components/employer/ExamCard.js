"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaRegFileLines, FaRegClock } from "react-icons/fa6";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "@/components/ui/ConfirmModal";

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

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Exam?"
        description={`Are you sure you want to delete "${exam.title}"? This action cannot be undone. All questions and submissions will also be deleted.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
