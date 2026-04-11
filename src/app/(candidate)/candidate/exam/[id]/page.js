"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExam } from "@/hooks/useExam";
import { useAuth } from "@/hooks/useAuth";
import { useTimer } from "@/hooks/useTimer";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Modal from "@/components/ui/Modal";
import Image from "next/image";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const { questions, fetchQuestions, submitExam, exams, fetchExams } =
    useExam();
  const { user } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showTimeout, setShowTimeout] = useState(false);
  const [exam, setExam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const tabSwitchSubmittedRef = useRef(false);

  useEffect(() => {
    fetchQuestions(id);
    fetchExams();
  }, [id]);

  useEffect(() => {
    if (exams.length > 0) {
      const found = exams.find((e) => e.id === parseInt(id));
      setExam(found);
    }
  }, [exams, id]);

  // Check if already submitted
  useEffect(() => {
    async function checkSubmission() {
      try {
        const res = await fetch(`/api/submissions/check?exam_id=${id}`);
        const data = await res.json();
        if (data.submitted) {
          setAlreadySubmitted(true);
          router.replace("/candidate/exam/completed?already=true");
        }
      } catch {
        // ignore
      }
    }
    if (id) checkSubmission();
  }, [id]);

  // Tab switch → auto submit
  useEffect(() => {
    async function handleVisibility() {
      if (document.hidden && !tabSwitchSubmittedRef.current && !submitting) {
        tabSwitchSubmittedRef.current = true;
        await handleSubmit(false, true);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [answers, submitting]);

  // Fullscreen exit detection (warning only)
  useEffect(() => {
    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        alert("Warning: Please stay in fullscreen mode during the exam.");
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleTimeout = useCallback(async () => {
    setShowTimeout(true);
    await handleSubmit(true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, id]);

  const { formatted, clearTimer } = useTimer(
    exam?.duration || 30,
    handleTimeout,
  );

  const currentQuestion = questions[currentIdx];

  function handleAnswer(value, isCheckbox = false) {
    setAnswers((prev) => {
      if (isCheckbox) {
        const current = prev[currentQuestion.id] || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [currentQuestion.id]: updated };
      }
      return { ...prev, [currentQuestion.id]: value };
    });
    localStorage.setItem(
      "exam_answers",
      JSON.stringify({ ...answers, [currentQuestion.id]: value }),
    );
  }

  async function handleSaveAndContinue() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      await handleSubmit(false, false);
    }
  }

  async function handleSubmit(isTimeout = false, isTabSwitch = false) {
    if (submitting) return;
    setSubmitting(true);
    clearTimer();
    try {
      await submitExam(parseInt(id), answers, isTimeout);
      localStorage.removeItem("exam_answers");
      localStorage.removeItem("exam_timer_end");
      if (!isTimeout) {
        router.push("/candidate/exam/completed");
      }
    } catch {
      setSubmitting(false);
    }
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
        <Navbar title="Akij Resource" role="candidate" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
        <Navbar title="Akij Resource" role="candidate" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar title="Akij Resource" role="candidate" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Timer bar */}
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            Question ({currentIdx + 1}/{questions.length})
          </span>
          <span className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">
            {formatted} left
          </span>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="font-semibold text-gray-800 mb-5">
            Q{currentIdx + 1}. {currentQuestion.question_text}
          </p>

          {currentQuestion.question_type === "Text" ? (
            <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                <span>↩</span>
                <span>↪</span>
                <span className="border-x border-gray-200 px-2">
                  Normal text ▾
                </span>
                <span className="font-bold">B</span>
                <span className="italic">I</span>
                <span className="underline">U</span>
              </div>
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type questions here.."
                rows={5}
                className="w-full bg-transparent outline-none text-sm text-gray-700 resize-none"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              {currentQuestion.options?.map((opt) => {
                const isSelected =
                  currentQuestion.question_type === "Checkbox"
                    ? (answers[currentQuestion.id] || []).includes(opt.id)
                    : answers[currentQuestion.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${isSelected ? "border-[#6B3FE7] bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    {currentQuestion.question_type === "Checkbox" ? (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAnswer(opt.id, true)}
                        className="accent-[#6B3FE7]"
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => handleAnswer(opt.id)}
                        className="accent-[#6B3FE7]"
                      />
                    )}
                    <span className="text-sm text-gray-700">
                      {opt.option_text}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() =>
                setCurrentIdx((prev) =>
                  prev + 1 < questions.length ? prev + 1 : prev,
                )
              }
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Skip this Question
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={submitting}
              className="bg-[#6B3FE7] hover:bg-[#5a33c4] text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : currentIdx === questions.length - 1
                  ? "Submit"
                  : "Save & Continue"}
            </button>
          </div>
        </div>
      </main>

      {/* Timeout Modal */}
      <Modal isOpen={showTimeout} onClose={() => {}}>
        <div className="flex flex-col items-center text-center py-6 px-4">
          <Image
            src="/timeout.png"
            alt="Timeout"
            width={80}
            height={80}
            className="object-contain mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Timeout!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Dear {user?.name}, Your exam time has been finished. Thank you for
            participating.
          </p>
          <button
            onClick={() => router.push("/candidate/dashboard")}
            className="border border-gray-200 px-6 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
