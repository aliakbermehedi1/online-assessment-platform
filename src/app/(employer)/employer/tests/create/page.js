"use client";

import { useState } from "react";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CreateTestForm from "@/components/employer/CreateTestForm";
import QuestionSetsPage from "@/components/employer/QuestionSetsPage";

export default function CreateTestPage() {
  const [step, setStep] = useState(1);
  const [examId, setExamId] = useState(null);
  const [basicInfo, setBasicInfo] = useState(null);

  function handleBasicInfoDone(exam) {
    setExamId(exam.id);
    setBasicInfo(exam);
    setStep(2);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar title="Online Test" role="employer" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h1 className="text-lg font-bold text-gray-800 mb-4">
            Manage Online Test
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-[#6B3FE7] text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {step > 1 ? "✓" : "1"}
              </div>
              <span
                className={`text-sm font-medium ${step >= 1 ? "text-[#6B3FE7]" : "text-gray-400"}`}
              >
                Basic Info
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200 max-w-16" />
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-[#6B3FE7] text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {step > 2 ? "✓" : "2"}
              </div>
              <span
                className={`text-sm font-medium ${step >= 2 ? "text-[#6B3FE7]" : "text-gray-400"}`}
              >
                Questions Sets
              </span>
            </div>
            <div className="ml-auto">
              <a
                href="/employer/dashboard"
                className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>

        {step === 1 && <CreateTestForm onDone={handleBasicInfoDone} />}
        {step === 2 && (
          <QuestionSetsPage examId={examId} basicInfo={basicInfo} />
        )}
      </main>

      <Footer />
    </div>
  );
}
