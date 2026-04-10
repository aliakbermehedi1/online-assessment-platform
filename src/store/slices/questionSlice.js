import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload;
    },
    addQuestion(state, action) {
      state.questions.push(action.payload);
    },
    updateQuestion(state, action) {
      const index = state.questions.findIndex(
        (q) => q.id === action.payload.id,
      );
      if (index !== -1) state.questions[index] = action.payload;
    },
    removeQuestion(state, action) {
      state.questions = state.questions.filter((q) => q.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion,
  setLoading,
  setError,
} = questionSlice.actions;
export default questionSlice.reducer;
