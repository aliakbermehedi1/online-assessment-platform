"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ title = "Dashboard", role = "employer" }) {
  const { user, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-8">
            <Link
              href={
                role === "employer"
                  ? "/employer/dashboard"
                  : "/candidate/dashboard"
              }
            >
              <Image
                src="/header-logo.png"
                alt="Akij Resource"
                width={120}
                height={32}
                className="object-contain"
              />
            </Link>
            {title && (
              <span className="text-gray-600 text-sm font-medium hidden sm:block">
                {title}
              </span>
            )}
          </div>

          {/* Right: User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-[#6B3FE7] flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  Ref. ID — {user?.refId || "---"}
                </p>
              </div>
              <i
                className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              ></i>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-44 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.name || "User"}
                  </p>
                </div>
                <button
                  onClick={() => logoutUser(role)}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-b-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-right-from-bracket text-xs"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
