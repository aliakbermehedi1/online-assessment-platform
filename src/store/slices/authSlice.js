import { createSlice } from "@reduxjs/toolkit";

function loadFromStorage() {
  if (typeof window === "undefined") return { user: null, role: null };
  try {
    const user = JSON.parse(localStorage.getItem("auth_user"));
    const role = localStorage.getItem("auth_role");
    return { user, role };
  } catch {
    return { user: null, role: null };
  }
}

const { user, role } = loadFromStorage();

const initialState = {
  user,
  role,
  isAuthenticated: !!user,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;
      // localStorage এ save
      localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
      localStorage.setItem("auth_role", action.payload.role);
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_role");
    },
  },
});

export const { setLoading, setUser, setError, logout } = authSlice.actions;
export default authSlice.reducer;
