"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import QuestionSetsPage from "@/components/employer/QuestionSetsPage";

export default function ViewTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { exams, fetchExams, fetchQuestions } = useExam();

  useEffect(() => {
    fetchExams();
    fetchQuestions(id);
  }, [id]);

  const exam = exams.find((e) => e.id === parseInt(id));

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
              <div className="w-7 h-7 rounded-full bg-[#6B3FE7] flex items-center justify-center text-xs font-bold text-white">
                ✓
              </div>
              <span className="text-sm font-medium text-[#6B3FE7]">
                Basic Info
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200 max-w-16" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#6B3FE7] flex items-center justify-center text-xs font-bold text-white">
                ✓
              </div>
              <span className="text-sm font-medium text-[#6B3FE7]">
                Questions Sets
              </span>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => router.push("/employer/dashboard")}
                className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {exam && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Basic Information</h2>
            </div>
            <p className="text-xs text-gray-400 mb-1">Online Test Title</p>
            <p className="font-semibold text-gray-800 mb-4">{exam.title}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                ["Total Candidates", exam.total_candidates],
                ["Total Slots", exam.total_slots],
                ["Total Question Set", exam.total_question_sets],
                ["Duration (Minutes)", exam.duration],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-semibold text-gray-800">
                    {val || "Not Set"}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-1">Question Type</p>
            <p className="font-semibold text-gray-800">{exam.question_type}</p>
          </div>
        )}

        <QuestionSetsPage examId={parseInt(id)} basicInfo={exam} />
      </main>

      <Footer />
    </div>
  );
}
