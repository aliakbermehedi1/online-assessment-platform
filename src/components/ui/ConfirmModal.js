"use client";

import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

/**
 * Reusable ConfirmModal
 * Props:
 *  isOpen       – boolean
 *  onClose      – () => void
 *  onConfirm    – () => void | Promise<void>
 *  loading      – boolean (optional)
 *  title        – string  (optional, default "Are you sure?")
 *  description  – string  (optional)
 *  confirmText  – string  (optional, default "Confirm")
 *  cancelText   – string  (optional, default "Cancel")
 *  variant      – "danger" | "warning"  (optional, default "danger")
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  const iconBg = isDanger ? "bg-red-50" : "bg-yellow-50";
  const iconColor = isDanger ? "text-red-500" : "text-yellow-500";
  const confirmBg = isDanger
    ? "bg-red-500 hover:bg-red-600"
    : "bg-yellow-500 hover:bg-yellow-600";

  const Icon = isDanger ? FiTrash2 : FiAlertTriangle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && onClose()}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 z-10 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}
          >
            <Icon className={`${iconColor} text-xl`} />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>

          {description && (
            <p className="text-sm text-gray-500 mb-6">{description}</p>
          )}

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 ${confirmBg} text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer`}
            >
              {loading ? "Please wait..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
