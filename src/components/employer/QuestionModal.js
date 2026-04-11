"use client";

import { useEffect, useState } from "react";
import { useExam } from "@/hooks/useExam";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

export default function QuestionModal({
  isOpen,
  onClose,
  examId,
  questionType,
  editingQuestion,
}) {
  const { createQuestion, editQuestion } = useExam();
  const [questionText, setQuestionText] = useState("");
  const [score, setScore] = useState(1);
  const [type, setType] = useState(questionType || "MCQ");
  const [options, setOptions] = useState([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.question_text);
      setScore(editingQuestion.score);
      setType(editingQuestion.question_type);
      setOptions(
        editingQuestion.options?.length > 0
          ? editingQuestion.options.map((o) => ({
              option_text: o.option_text,
              is_correct: o.is_correct,
            }))
          : [
              { option_text: "", is_correct: false },
              { option_text: "", is_correct: false },
            ],
      );
    } else {
      setQuestionText("");
      setScore(1);
      setType(questionType || "MCQ");
      setOptions([
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ]);
    }
    setError("");
  }, [editingQuestion, isOpen]);

  function handleOptionText(idx, val) {
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, option_text: val } : o)),
    );
  }

  function handleCorrect(idx) {
    setOptions((prev) =>
      prev.map((o, i) => ({
        ...o,
        is_correct:
          type === "Checkbox"
            ? i === idx
              ? !o.is_correct
              : o.is_correct
            : i === idx,
      })),
    );
  }

  function addOption() {
    if (options.length < 5)
      setOptions((prev) => [...prev, { option_text: "", is_correct: false }]);
  }

  function removeOption(idx) {
    if (options.length > 2)
      setOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave(addMore = false) {
    if (!questionText.trim()) {
      setError("Question text is required");
      return;
    }
    if (type !== "Text" && options.some((o) => !o.option_text.trim())) {
      setError("All options must have text");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = {
        exam_id: examId,
        question_text: questionText,
        question_type: type,
        score,
        options: type === "Text" ? [] : options,
      };
      if (editingQuestion) {
        await editQuestion({ ...data, id: editingQuestion.id });
      } else {
        await createQuestion(data);
      }
      if (addMore) {
        setQuestionText("");
        setScore(1);
        setOptions([
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
        ]);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
            {editingQuestion ? "✎" : "1"}
          </span>
          <span className="font-semibold text-gray-700">
            {editingQuestion ? "Edit Question" : "Question 1"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Score:</span>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value) || 1)}
            className="w-14 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center outline-none focus:border-[#6B3FE7]"
            min={1}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#6B3FE7]"
          >
            <option value="MCQ">Radio</option>
            <option value="Checkbox">Checkbox</option>
            <option value="Text">Text</option>
          </select>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 text-xl"
          >
            🗑
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
          <span>↩</span>
          <span>↪</span>
          <span className="border-x border-gray-200 px-2">Normal text ▾</span>
          <span>≡ ▾</span>
          <span className="font-bold">B</span>
          <span className="italic">I</span>
        </div>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Type your question here..."
          rows={3}
          className="w-full bg-transparent outline-none text-sm text-gray-700 resize-none"
        />
      </div>

      {type === "Text" ? (
        <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
          <p className="text-xs text-gray-400 mb-2">
            Answer field (candidate will type here)
          </p>
          <div className="h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-300 text-sm">
            Text answer area
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {options.map((opt, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-500">
                  {OPTION_LABELS[idx]}
                </span>
                {type === "MCQ" ? (
                  <input
                    type="radio"
                    checked={opt.is_correct}
                    onChange={() => handleCorrect(idx)}
                    className="accent-[#6B3FE7]"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={opt.is_correct}
                    onChange={() => handleCorrect(idx)}
                    className="accent-[#6B3FE7]"
                  />
                )}
                <span className="text-xs text-gray-400">
                  Set as correct answer
                </span>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(idx)}
                    className="ml-auto text-gray-400 hover:text-red-400"
                  >
                    🗑
                  </button>
                )}
              </div>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <textarea
                  value={opt.option_text}
                  onChange={(e) => handleOptionText(idx, e.target.value)}
                  placeholder={`Option ${OPTION_LABELS[idx]}`}
                  rows={2}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 resize-none"
                />
              </div>
            </div>
          ))}
          {options.length < 5 && (
            <button
              onClick={addOption}
              className="text-[#6B3FE7] text-sm font-medium flex items-center gap-1 hover:underline w-fit"
            >
              + Another options
            </button>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => handleSave(false)}
          disabled={loading}
        >
          Save
        </Button>
        <Button onClick={() => handleSave(true)} disabled={loading}>
          {loading ? "Saving..." : "Save & Add More"}
        </Button>
      </div>
    </Modal>
  );
}
