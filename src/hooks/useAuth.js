"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setLoading,
  setError,
  logout,
} from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  async function loginEmployer(email, password) {
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.post("/auth/employer", {
        email,
        password,
      });
      dispatch(setUser({ user: res.data.user, role: "employer" }));
      window.location.href = "/employer/dashboard";
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function loginCandidate(email, password) {
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.post("/auth/candidate", {
        email,
        password,
      });
      dispatch(setUser({ user: res.data.user, role: "candidate" }));
      window.location.href = "/candidate/dashboard";
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function logoutUser(currentRole) {
    try {
      const endpoint =
        currentRole === "employer" ? "/auth/employer" : "/auth/candidate";
      await axiosInstance.delete(endpoint);
    } finally {
      dispatch(logout());
      window.location.href =
        currentRole === "employer" ? "/employer/login" : "/candidate/login";
    }
  }

  return {
    user,
    role,
    isAuthenticated,
    loading,
    error,
    loginEmployer,
    loginCandidate,
    logoutUser,
  };
}
