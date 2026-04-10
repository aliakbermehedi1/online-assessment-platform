"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Navbar({ title = "Dashboard", role = "employer" }) {
  const { user, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href={
              role === "employer"
                ? "/employer/dashboard"
                : "/candidate/dashboard"
            }
          >
            <div className="font-black text-[#1a1a2e] text-lg tracking-tight">
              AKI<span className="text-[#6B3FE7]">J</span> RESOURCE
            </div>
          </Link>
          {title && (
            <span className="text-gray-600 text-sm font-medium">{title}</span>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                Ref. ID - {user?.refId || "---"}
              </p>
            </div>
            <span className="text-gray-400 text-xs">▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-50">
              <button
                onClick={() => logoutUser(role)}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
