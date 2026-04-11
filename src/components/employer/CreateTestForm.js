"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useExam } from "@/hooks/useExam";
import Button from "@/components/ui/Button";
import DropdownField from "@/components/ui/DropdownField";
import { useState } from "react";

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    {children}
    {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  total_candidates: Yup.number()
    .typeError("Must be a number")
    .required("Required")
    .min(1),
  total_slots: Yup.number().required("Required").min(1),
  total_question_sets: Yup.number().required("Required").min(1),
  question_type: Yup.string().required("Required"),
  duration: Yup.number()
    .typeError("Must be a number")
    .required("Duration is required")
    .min(1, "Min 1 minute"),
  start_time: Yup.string().optional(),
  end_time: Yup.string().optional(),
});

const SLOT_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  label: String(n),
  value: n,
}));
const QSET_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  label: String(n),
  value: n,
}));
const QTYPE_OPTIONS = [
  { label: "MCQ", value: "MCQ" },
  { label: "Checkbox", value: "Checkbox" },
  { label: "Text", value: "Text" },
];

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
      duration: initialData?.duration || "",
      start_time: initialData?.start_time || "",
      end_time: initialData?.end_time || "",
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
        const exam = await createExam({
          ...values,
          start_time: values.start_time || null,
          end_time: values.end_time || null,
        });
        onDone(exam);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400 ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-400"
        : "border-gray-300"
    }`;

  if (preview) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>
          <button
            onClick={() => setPreview(false)}
            className="text-[#6B3FE7] text-sm hover:underline"
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
            ["Duration (Minutes)", formik.values.duration],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="font-semibold text-gray-800">{val}</p>
            </div>
          ))}
        </div>
        {(formik.values.start_time || formik.values.end_time) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {formik.values.start_time && (
              <div>
                <p className="text-xs text-gray-400">Start Time</p>
                <p className="font-semibold text-gray-800">
                  {formik.values.start_time}
                </p>
              </div>
            )}
            {formik.values.end_time && (
              <div>
                <p className="text-xs text-gray-400">End Time</p>
                <p className="font-semibold text-gray-800">
                  {formik.values.end_time}
                </p>
              </div>
            )}
          </div>
        )}
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
    <div className="bg-white rounded-xl border border-gray-100 p-8">
      <h2 className="font-semibold text-gray-900 text-base mb-6">
        Basic Information
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex flex-col gap-5">
        <div>
          <Label required>Online Test Title</Label>
          <input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter online test title"
            className={inputClass("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Total Candidates</Label>
            <input
              name="total_candidates"
              type="number"
              value={formik.values.total_candidates}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter total candidates"
              className={inputClass("total_candidates")}
            />
            {formik.touched.total_candidates &&
              formik.errors.total_candidates && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.total_candidates}
                </p>
              )}
          </div>

          <DropdownField
            label="Total Slots"
            required
            placeholder="Select total slots"
            options={SLOT_OPTIONS}
            value={formik.values.total_slots}
            onChange={(val) => formik.setFieldValue("total_slots", val)}
            error={formik.touched.total_slots && formik.errors.total_slots}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownField
            label="Total Question Set"
            required
            placeholder="Select total question set"
            options={QSET_OPTIONS}
            value={formik.values.total_question_sets}
            onChange={(val) => formik.setFieldValue("total_question_sets", val)}
            error={
              formik.touched.total_question_sets &&
              formik.errors.total_question_sets
            }
          />

          <DropdownField
            label="Question Type"
            required
            placeholder="Select question type"
            options={QTYPE_OPTIONS}
            value={formik.values.question_type}
            onChange={(val) => formik.setFieldValue("question_type", val)}
            error={formik.touched.question_type && formik.errors.question_type}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Start Time</Label>
            <input
              name="start_time"
              type="time"
              value={formik.values.start_time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass("start_time")}
            />
          </div>
          <div>
            <Label>End Time</Label>
            <input
              name="end_time"
              type="time"
              value={formik.values.end_time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass("end_time")}
            />
          </div>
          <div>
            <Label required>Duration (minutes)</Label>
            <input
              name="duration"
              type="number"
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 30"
              min={1}
              className={inputClass("duration")}
            />
            {formik.touched.duration && formik.errors.duration && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.duration}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => (window.location.href = "/employer/dashboard")}
          >
            Cancel
          </Button>
          <Button type="button" onClick={formik.handleSubmit}>
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
