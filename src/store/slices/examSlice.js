import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exams: [],
  currentExam: null,
  loading: false,
  error: null,
  totalCount: 0,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExams(state, action) {
      state.exams = action.payload.exams;
      state.totalCount = action.payload.totalCount || 0;
    },
    setCurrentExam(state, action) {
      state.currentExam = action.payload;
    },
    addExam(state, action) {
      state.exams.unshift(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setExams, setCurrentExam, addExam, setLoading, setError } =
  examSlice.actions;
export default examSlice.reducer;
