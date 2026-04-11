"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExam } from "@/hooks/useExam";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Modal from "@/components/ui/Modal";

const STORAGE_ANSWERS_KEY = (id) => `exam_answers_${id}`;
const STORAGE_TIMER_KEY = (id) => `exam_timer_end_${id}`;

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
  const [timeLeft, setTimeLeft] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const submittedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function init() {
      // Check already submitted
      try {
        const res = await fetch(`/api/submissions/check?exam_id=${id}`);
        const data = await res.json();
        if (data.submitted) {
          router.replace("/candidate/exam/completed?already=true");
          return;
        }
      } catch {
        /* offline - continue */
      }

      // Load saved answers
      const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY(id));
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch {
          /* ignore */
        }
      }
    }
    if (id) init();
    fetchQuestions(id);
    fetchExams();
  }, [id]);

  useEffect(() => {
    if (exams.length > 0) {
      const found = exams.find((e) => e.id === parseInt(id));
      setExam(found);
    }
  }, [exams, id]);

  // Timer setup — uses exam.duration directly
  useEffect(() => {
    if (!exam || timeLeft !== null) return;
    const timerKey = STORAGE_TIMER_KEY(id);
    const saved = localStorage.getItem(timerKey);
    let endTime;
    if (saved) {
      endTime = parseInt(saved);
    } else {
      endTime = Date.now() + exam.duration * 60 * 1000;
      localStorage.setItem(timerKey, endTime.toString());
    }
    const remaining = Math.floor((endTime - Date.now()) / 1000);
    setTimeLeft(remaining > 0 ? remaining : 0);
  }, [exam]);

  // Timer tick
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (!submittedRef.current) {
        submittedRef.current = true;
        // eslint-disable-next-line react-hooks/immutability
        handleTimeout();
      }
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  // Tab switch detection
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        alert("Warning: Tab switching detected! Please stay on the exam page.");
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Online/offline
  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  function saveAnswersLocally(ans) {
    localStorage.setItem(STORAGE_ANSWERS_KEY(id), JSON.stringify(ans));
  }

  function handleAnswer(value, isCheckbox = false) {
    const qId = questions[currentIdx].id;
    setAnswers((prev) => {
      let updated;
      if (isCheckbox) {
        const current = prev[qId] || [];
        const newArr = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        updated = { ...prev, [qId]: newArr };
      } else {
        updated = { ...prev, [qId]: value };
      }
      saveAnswersLocally(updated);
      return updated;
    });
  }

  async function handleTimeout() {
    setShowTimeout(true);
    clearTimeout(timerRef.current);
    try {
      const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY(id));
      const finalAnswers = savedAnswers ? JSON.parse(savedAnswers) : answers;
      await submitExam(parseInt(id), finalAnswers, true);
      localStorage.removeItem(STORAGE_ANSWERS_KEY(id));
      localStorage.removeItem(STORAGE_TIMER_KEY(id));
    } catch {
      /* save offline */
    }
  }

  async function handleSaveAndContinue() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      await handleManualSubmit();
    }
  }

  async function handleManualSubmit() {
    if (submitting || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    clearTimeout(timerRef.current);
    try {
      await submitExam(parseInt(id), answers, false);
      localStorage.removeItem(STORAGE_ANSWERS_KEY(id));
      localStorage.removeItem(STORAGE_TIMER_KEY(id));
      router.push("/candidate/exam/completed");
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
    }
  }

  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
  const seconds = timeLeft !== null ? timeLeft % 60 : 0;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isWarning = timeLeft !== null && timeLeft <= 300;

  if (!questions.length || !exam) {
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

  const currentQuestion = questions[currentIdx];

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar title="Akij Resource" role="candidate" />

      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center text-sm py-2 px-4">
          You are offline. Answers are saved locally and will auto-submit when
          internet returns.
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Timer bar */}
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            Question ({currentIdx + 1}/{questions.length})
          </span>
          <span
            className={`px-4 py-2 rounded-lg font-semibold ${isWarning ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-700"}`}
          >
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
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
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
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
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
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Timeout!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Dear {user?.name}, Your exam time has been finished. Thank you for
            participating.
          </p>
          <button
            onClick={() => router.push("/candidate/dashboard")}
            className="border border-gray-200 px-6 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
