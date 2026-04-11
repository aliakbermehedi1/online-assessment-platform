"use client";

import { useEffect, useState } from "react";
import { useExam } from "@/hooks/useExam";
import Button from "@/components/ui/Button";
import QuestionModal from "./QuestionModal";

export default function QuestionSetsPage({ examId, basicInfo }) {
  const { questions, fetchQuestions, deleteQuestion } = useExam();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    if (examId) fetchQuestions(examId);
  }, [examId]);

  function handleEdit(q) {
    setEditingQuestion(q);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditingQuestion(null);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (confirm("Remove this question?")) {
      await deleteQuestion(id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-700">
              Question {idx + 1}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                {q.question_type}
              </span>
              <span className="text-xs text-gray-500">{q.score} pt</span>
            </div>
          </div>
          <p className="font-semibold text-gray-800 mb-3">{q.question_text}</p>

          {q.options &&
            q.options.map((opt, i) => (
              <div
                key={opt.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1.5 text-sm ${opt.is_correct ? "bg-gray-50 border border-gray-200" : "bg-gray-50"}`}
              >
                <span className="text-gray-500">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span className="flex-1">{opt.option_text}</span>
                {opt.is_correct && <span className="text-green-500">✅</span>}
              </div>
            ))}

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => handleEdit(q)}
              className="text-[#6B3FE7] text-sm font-medium hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(q.id)}
              className="text-red-500 text-sm font-medium hover:underline"
            >
              Remove From Exam
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full bg-[#6B3FE7] hover:bg-[#5a33c4] text-white py-4 rounded-xl font-semibold text-sm transition-colors"
      >
        Add Question
      </button>

      <QuestionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuestion(null);
        }}
        examId={examId}
        questionType={basicInfo?.question_type || "MCQ"}
        editingQuestion={editingQuestion}
      />
    </div>
  );
}
