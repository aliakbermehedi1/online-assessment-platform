"use client";

import { useEffect, useState } from "react";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import EmployerExamCard from "@/components/employer/ExamCard";
import Link from "next/link";
import Image from "next/image";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";

export default function EmployerDashboard() {
  const { exams, loading, totalCount, fetchExams } = useExam();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    fetchExams({ search, page, limit });
  }, [search, page]);

  const totalPages = Math.ceil(totalCount / limit) || 1;
  const hasExams = exams.length > 0;

  function handleDelete(deletedId) {
    // Re-fetch to sync with server after deletion
    fetchExams({ search, page, limit });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar title="Dashboard" role="employer" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-[22px] font-bold text-gray-900 whitespace-nowrap">
            Online Tests
          </h1>

          <div className="relative flex-1 max-w-[540px] mx-4">
            <input
              type="text"
              placeholder="Search by exam title"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-4 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100 bg-white text-gray-500 placeholder-gray-400"
            />
            <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B3FE7] text-lg" />
          </div>

          <Link href="/employer/tests/create">
            <button className="bg-[#6B3FE7] hover:bg-[#5a33c4] text-white px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors">
              Create Online Test
            </button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasExams ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Image
              src="/no-online-test.png"
              alt="No Online Test"
              width={80}
              height={80}
              className="object-contain mb-1"
            />
            <p className="text-[17px] font-bold text-gray-800">
              No Online Test Available
            </p>
            <p className="text-sm text-gray-400">
              Currently, there are no online tests available. Please check back
              later for updates.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <EmployerExamCard
                  key={exam.id}
                  exam={exam}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#111827] text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#111827] hover:text-[#111827] hover:bg-purple-50 transition-all"
                >
                  <FiChevronLeft className="text-base" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? "bg-[#F8F8F8] text-[#2E2E2F]"
                          : "border border-gray-100 text-[#2E2E2F] hover:border-[##F8F8F8] hover:text-[#2E2E2F] hover:bg-purple-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#111827] text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#111827] hover:text-[#111827] hover:bg-purple-50 transition-all"
                >
                  <FiChevronRight className="text-base" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Online Test Per Page</span>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                  <span className="font-semibold text-gray-800">{limit}</span>
                  <FiChevronUp className="text-gray-600 text-sm" />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
