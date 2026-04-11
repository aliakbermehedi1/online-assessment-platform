"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useExam } from "@/hooks/useExam";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState } from "react";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  total_candidates: Yup.number().required("Required").min(1),
  total_slots: Yup.number().required("Required").min(1),
  total_question_sets: Yup.number().required("Required").min(1),
  question_type: Yup.string().required("Required"),
  start_time: Yup.string().required("Required"),
  end_time: Yup.string().required("Required"),
  duration: Yup.number().required("Required").min(1),
});

export default function CreateTestForm({ onDone, initialData }) {
  const { createExam } = useExam();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || "",
      total_candidates: initialData?.total_candidates || "",
      total_slots: initialData?.total_slots || "",
      total_question_sets: initialData?.total_question_sets || "",
      question_type: initialData?.question_type || "",
      start_time: initialData?.start_time || "",
      end_time: initialData?.end_time || "",
      duration: initialData?.duration || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!preview) {
        setPreview(true);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const exam = await createExam(values);
        onDone(exam);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  if (preview) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>
          <button
            onClick={() => setPreview(false)}
            className="text-[#6B3FE7] text-sm flex items-center gap-1 hover:underline"
          >
            ✏️ Edit
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-1">Online Test Title</p>
        <p className="font-semibold text-gray-800 mb-4">
          {formik.values.title}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            ["Total Candidates", formik.values.total_candidates],
            ["Total Slots", formik.values.total_slots],
            ["Total Question Set", formik.values.total_question_sets],
            ["Duration Per Slots (Minutes)", formik.values.duration],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="font-semibold text-gray-800">{val}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-1">Question Type</p>
        <p className="font-semibold text-gray-800 mb-6">
          {formik.values.question_type}
        </p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setPreview(false)}>
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="font-semibold text-gray-800 mb-6">Basic Information</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Online Test Title *"
          name="title"
          placeholder="Enter online test title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Candidates *"
            name="total_candidates"
            type="number"
            placeholder="Enter total candidates"
            value={formik.values.total_candidates}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.total_candidates && formik.errors.total_candidates
            }
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Total Slots *
            </label>
            <select
              name="total_slots"
              value={formik.values.total_slots}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Select total slots</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {formik.touched.total_slots && formik.errors.total_slots && (
              <p className="text-xs text-red-500">
                {formik.errors.total_slots}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Total Question Set *
            </label>
            <select
              name="total_question_sets"
              value={formik.values.total_question_sets}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Select total question set</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Question Type *
            </label>
            <select
              name="question_type"
              value={formik.values.question_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Select question type</option>
              <option value="MCQ">MCQ</option>
              <option value="Checkbox">Checkbox</option>
              <option value="Text">Text</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Time *"
            name="start_time"
            type="datetime-local"
            value={formik.values.start_time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.start_time && formik.errors.start_time}
          />
          <Input
            label="End Time *"
            name="end_time"
            type="datetime-local"
            value={formik.values.end_time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.end_time && formik.errors.end_time}
          />
          <Input
            label="Duration (minutes)"
            name="duration"
            type="number"
            placeholder="Duration Time"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.duration && formik.errors.duration}
          />
        </div>
        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => (window.location.href = "/employer/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit">Save & Continue</Button>
        </div>
      </form>
    </div>
  );
}
