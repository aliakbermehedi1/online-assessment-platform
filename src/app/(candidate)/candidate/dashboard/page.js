"use client";

import { useEffect, useState } from "react";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CandidateExamCard from "@/components/candidate/ExamCard";

export default function CandidateDashboard() {
  const { exams, loading, totalCount, fetchExams } = useExam();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    fetchExams({ search, page, limit });
  }, [search, page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar title="Dashboard" role="candidate" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-gray-800">Online Tests</h1>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by exam title"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100 bg-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B3FE7]">
              🔍
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-6xl">📋</div>
            <p className="text-lg font-semibold text-gray-700">
              No Online Test Available
            </p>
            <p className="text-sm text-gray-400">
              Currently, there are no online tests available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <CandidateExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:border-[#6B3FE7] hover:text-[#6B3FE7]"
              >
                ‹
              </button>
              <span className="w-8 h-8 flex items-center justify-center bg-[#6B3FE7] text-white rounded-lg text-sm font-semibold">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:border-[#6B3FE7] hover:text-[#6B3FE7]"
              >
                ›
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Online Test Per Page</span>
              <span className="font-semibold text-gray-700">{limit} ▲</span>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
