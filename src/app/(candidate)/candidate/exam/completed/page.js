"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

export default function CompletedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const already = searchParams.get("already");

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Navbar title="Akij Resource" role="candidate" />

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

      <Footer />
    </div>
  );
}
