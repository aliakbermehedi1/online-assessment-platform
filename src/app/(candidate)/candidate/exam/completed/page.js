"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function CompletedPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar title="Akij Resource" role="candidate" />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-100 w-full max-w-2xl p-12 flex flex-col items-center text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Test Completed
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Congratulations! {user?.name}, You have completed your exam. Thank
            you for participating.
          </p>
          <button
            onClick={() => router.push("/candidate/dashboard")}
            className="border border-gray-200 px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
