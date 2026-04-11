"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import EditTestForm from "@/components/employer/EditTestForm";
import QuestionSetsPage from "@/components/employer/QuestionSetsPage";

export default function EditTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { exams, fetchExams } = useExam();
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await fetchExams();
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (exams.length > 0) {
      const found = exams.find((e) => e.id === parseInt(id));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (found) setExam(found);
    }
  }, [exams, id]);

  function handleBasicInfoDone(updatedExam) {
    setExam(updatedExam);
    setStep(2);
  }

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
        <Navbar title="Online Test" role="employer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar title="Online Test" role="employer" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Step indicator */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h1 className="text-lg font-bold text-gray-800 mb-4">
            Edit Online Test
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
                2
              </div>
              <span
                className={`text-sm font-medium ${step >= 2 ? "text-[#6B3FE7]" : "text-gray-400"}`}
              >
                Questions Sets
              </span>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => router.push("/employer/dashboard")}
                className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {step === 1 && (
          <EditTestForm
            initialData={exam}
            onDone={handleBasicInfoDone}
            onSkipToQuestions={() => setStep(2)}
          />
        )}
        {step === 2 && <QuestionSetsPage examId={exam.id} basicInfo={exam} />}
      </main>

      <Footer />
    </div>
  );
}
