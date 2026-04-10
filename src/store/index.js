import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import examReducer from "./slices/examSlice";
import questionReducer from "./slices/questionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    question: questionReducer,
  },
});

export default store;
