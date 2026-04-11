"use client";

import { useEffect, useState } from "react";
import { useExam } from "@/hooks/useExam";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import EmployerExamCard from "@/components/employer/ExamCard";
import Link from "next/link";
import Image from "next/image";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="#6B3FE7"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16.5 16.5L21 21"
      stroke="#6B3FE7"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronLeft = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
    <path
      d="M6 1L1 6L6 11"
      stroke="#374151"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
    <path
      d="M1 1L6 6L1 11"
      stroke="#374151"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronUp = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path
      d="M1 5L5 1L9 5"
      stroke="#374151"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
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
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
          </div>

          <Link href="/employer/tests/create">
            <button className="bg-[#6B3FE7] hover:bg-[#5a33c4] text-white px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors">
              Create Online Test
            </button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-xl flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasExams ? (
          /* Empty State — no pagination */
          <div className="rounded-xl flex flex-col items-center justify-center py-24 gap-3">
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
          /* Exams Grid + Pagination */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <EmployerExamCard key={exam.id} exam={exam} />
              ))}
            </div>

            {/* Pagination — only when exams exist */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center text-gray-600 disabled:opacity-30 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft />
                </button>
                <span className="text-sm font-medium text-gray-800">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center justify-center text-gray-600 disabled:opacity-30 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Online Test Per Page</span>
                <span className="font-semibold text-gray-800 ml-1">
                  {limit}
                </span>
                <ChevronUp />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
