"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(durationMinutes, onTimeout) {
  const totalSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("exam_timer_end");
      if (saved) {
        const remaining = Math.floor((parseInt(saved) - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
      }
    }
    return totalSeconds;
  });

  const timerRef = useRef(null);
  const hasTimedOut = useRef(false);

  const startTimer = useCallback(() => {
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("exam_timer_end");
      if (!existing) {
        localStorage.setItem(
          "exam_timer_end",
          (Date.now() + totalSeconds * 1000).toString(),
        );
      }
    }
  }, [totalSeconds]);

  useEffect(() => {
    startTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!hasTimedOut.current) {
            hasTimedOut.current = true;
            localStorage.removeItem("exam_timer_end");
            onTimeout?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  function clearTimer() {
    localStorage.removeItem("exam_timer_end");
    clearInterval(timerRef.current);
  }

  return { timeLeft, formatted, clearTimer };
}
