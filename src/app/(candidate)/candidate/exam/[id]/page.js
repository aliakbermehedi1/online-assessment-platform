"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExam } from "@/hooks/useExam";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Modal from "@/components/ui/Modal";
import Image from "next/image";

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
  const [checkDone, setCheckDone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const submittedRef = useRef(false);
  const timerRef = useRef(null);

  // Check already submitted
  useEffect(() => {
    async function checkAndLoad() {
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

      // Load saved answers from localStorage
      const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY(id));
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch {
          /* ignore */
        }
      }
      setCheckDone(true);
    }
    if (id) checkAndLoad();
  }, [id]);

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

  // Timer setup - persists across offline
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
  }, [exam, id]);

  // Timer tick
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (!submittedRef.current) {
        submittedRef.current = true;
        setShowTimeout(true);
        // eslint-disable-next-line react-hooks/immutability
        handleSubmit(true);
      }
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  // Tab switch → auto submit
  useEffect(() => {
    async function handleVisibility() {
      if (document.hidden && !submittedRef.current && !submitting) {
        submittedRef.current = true;
        await handleSubmit(false, true);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [answers, submitting]);

  function saveAnswersLocally(newAnswers) {
    localStorage.setItem(STORAGE_ANSWERS_KEY(id), JSON.stringify(newAnswers));
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

  async function handleSaveAndContinue() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      await handleSubmit(false, false);
    }
  }

  async function handleSubmit(
    isTimeout = false,
    isTabSwitch = false,
    overrideAnswers = null,
    autoOnline = false,
  ) {
    if (submitting && !autoOnline) return;
    setSubmitting(true);
    clearTimeout(timerRef.current);
    const finalAnswers = overrideAnswers || answers;

    if (!navigator.onLine) {
      // Save offline marker and wait for reconnect
      localStorage.setItem(`exam_offline_${id}`, "true");
      saveAnswersLocally(finalAnswers);
      setSubmitting(false);
      return;
    }

    try {
      await submitExam(parseInt(id), finalAnswers, isTimeout);
      localStorage.removeItem(STORAGE_ANSWERS_KEY(id));
      localStorage.removeItem(STORAGE_TIMER_KEY(id));
      localStorage.removeItem(`exam_offline_${id}`);
      if (!isTimeout) {
        router.push("/candidate/exam/completed");
      }
    } catch {
      // Save for retry
      saveAnswersLocally(finalAnswers);
      localStorage.setItem(`exam_offline_${id}`, "true");
      setSubmitting(false);
    }
  }

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Try to submit if we have pending answers
      const pendingAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY(id));
      const wasOffline = localStorage.getItem(`exam_offline_${id}`);
      if (pendingAnswers && wasOffline) {
        const parsed = JSON.parse(pendingAnswers);
        handleSubmit(false, false, parsed, true);
        localStorage.removeItem(`exam_offline_${id}`);
      }
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [id]);

  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
  const seconds = timeLeft !== null ? timeLeft % 60 : 0;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isWarning = timeLeft !== null && timeLeft <= 300; // last 5 min

  if (!checkDone || !questions.length) {
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

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center text-sm py-2 px-4">
          ⚠️ You are offline. Answers are being saved locally and will
          auto-submit when internet returns.
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

        {/* Question navigator */}
        <div className="mt-4 flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                idx === currentIdx
                  ? "bg-[#6B3FE7] text-white"
                  : answers[q.id] !== undefined && answers[q.id] !== ""
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#6B3FE7]"
              }`}
            >
              {idx + 1}
            </button>
          ))}
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
