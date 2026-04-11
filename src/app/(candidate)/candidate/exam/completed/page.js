"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

function CompletedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const already = searchParams.get("already");

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-100 w-full max-w-4xl p-12 flex flex-col items-center text-center">
        <Image
          src="/test-completed.png"
          alt="Test Completed"
          width={72}
          height={72}
          className="object-contain mb-5"
        />
        <h2 className="text-[22px] font-bold text-gray-900 mb-3">
          Test Completed
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xl">
          {already
            ? `You have already submitted this exam. Thank you for participating.`
            : `Congratulations! ${user?.name}, You have completed your exam. Thank you for participating.`}
        </p>
        <button
          onClick={() => router.push("/candidate/dashboard")}
          className="border border-gray-200 px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}

export default function CompletedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Navbar title="Akij Resource" role="candidate" />
      <Suspense
        fallback={
          <main className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#6B3FE7] border-t-transparent rounded-full animate-spin" />
          </main>
        }
      >
        <CompletedContent />
      </Suspense>
      <Footer />
    </div>
  );
}
