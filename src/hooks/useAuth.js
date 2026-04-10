"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setLoading,
  setError,
  logout,
} from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
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
      router.push("/employer/dashboard");
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
      router.push("/candidate/dashboard");
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function logoutUser(role) {
    try {
      const endpoint =
        role === "employer" ? "/auth/employer" : "/auth/candidate";
      await axiosInstance.delete(endpoint);
    } finally {
      dispatch(logout());
      router.push(role === "employer" ? "/employer/login" : "/candidate/login");
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
