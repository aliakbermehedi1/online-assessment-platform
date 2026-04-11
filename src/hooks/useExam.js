"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setExams,
  setCurrentExam,
  setLoading,
  setError,
} from "@/store/slices/examSlice";
import {
  setQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion,
} from "@/store/slices/questionSlice";
import axiosInstance from "@/lib/axios";

export function useExam() {
  const dispatch = useDispatch();
  const { exams, currentExam, loading, error, totalCount } = useSelector(
    (state) => state.exam,
  );
  const { questions } = useSelector((state) => state.question);

  async function fetchExams(params = {}) {
    dispatch(setLoading(true));
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axiosInstance.get(`/exams?${query}`);
      dispatch(
        setExams({ exams: res.data.exams, totalCount: res.data.totalCount }),
      );
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Failed to fetch exams"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function createExam(data) {
    try {
      const res = await axiosInstance.post("/exams", data);
      return res.data.exam;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to create exam");
    }
  }

  async function fetchQuestions(examId) {
    try {
      const res = await axiosInstance.get(`/questions?exam_id=${examId}`);
      dispatch(setQuestions(res.data.questions));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.error || "Failed to fetch questions"),
      );
    }
  }

  async function createQuestion(data) {
    try {
      const res = await axiosInstance.post("/questions", data);
      dispatch(addQuestion(res.data.question));
      return res.data.question;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to create question");
    }
  }

  async function editQuestion(data) {
    try {
      const res = await axiosInstance.put("/questions", data);
      dispatch(updateQuestion(res.data.question));
      return res.data.question;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to update question");
    }
  }

  async function deleteQuestion(id) {
    try {
      await axiosInstance.delete(`/questions?id=${id}`);
      dispatch(removeQuestion(id));
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to delete question");
    }
  }

  async function submitExam(examId, answers, isTimeout = false) {
    try {
      await axiosInstance.post("/submissions", {
        exam_id: examId,
        answers,
        is_timeout: isTimeout,
      });
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to submit exam");
    }
  }

  return {
    exams,
    currentExam,
    loading,
    error,
    totalCount,
    questions,
    fetchExams,
    createExam,
    fetchQuestions,
    createQuestion,
    editQuestion,
    deleteQuestion,
    submitExam,
    setCurrentExam: (exam) => dispatch(setCurrentExam(exam)),
  };
}
