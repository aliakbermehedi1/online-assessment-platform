"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/ui/Footer";
import Image from "next/image";

export default function LoginSelectorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Image
          src="/header-logo.png"
          alt="Akij Resource"
          width={120}
          height={32}
          className="object-contain"
        />
        <span className="font-semibold text-gray-700 text-sm">
          Akij Resource
        </span>
        <div className="w-[120px]" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
          <button
            onClick={() => router.push("/employer/login")}
            className="bg-white border-2 border-gray-100 hover:border-[#6B3FE7] rounded-2xl p-8 flex flex-col items-center gap-4 transition-all hover:shadow-lg group cursor-pointer"
          >
            <div className="w-16 h-16 bg-purple-50 group-hover:bg-purple-100 rounded-full flex items-center justify-center text-3xl transition-colors">
              🏢
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg">Employer</p>
              <p className="text-gray-400 text-sm mt-1">
                Create and manage online tests
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/candidate/login")}
            className="bg-white border-2 border-gray-100 hover:border-[#6B3FE7] rounded-2xl p-8 flex flex-col items-center gap-4 transition-all hover:shadow-lg group cursor-pointer"
          >
            <div className="w-16 h-16 bg-purple-50 group-hover:bg-purple-100 rounded-full flex items-center justify-center text-3xl transition-colors">
              👤
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-800 text-lg">Candidate</p>
              <p className="text-gray-400 text-sm mt-1">
                Take online assessment tests
              </p>
            </div>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
