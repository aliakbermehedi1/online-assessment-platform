"use client";
import { useEffect, useRef, useState } from "react";

const ChevronIcon = ({ open }) => (
  <svg
    className={`h-4 w-4 text-gray-400 transition-transform duration-200 dark:text-gray-500 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const DropdownField = ({
  label,
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  labelKey = "label",
  valueKey = "value",
  searchable = true,
  clearable = false,
  required = false,
  disabled = false,
  loading = false,
  error,
  size = "md",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find((opt) => opt[valueKey] === value);
  const filteredOptions = options.filter((opt) =>
    opt[labelKey]?.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sizeClasses = {
    sm: "h-9 text-sm",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center gap-2 rounded-md border px-3 transition-all ${sizeClasses[size]} ${
          disabled
            ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            : "cursor-pointer bg-white dark:bg-gray-900"
        } ${
          open
            ? "border-blue-500 ring-1 ring-blue-500 dark:border-blue-400"
            : error
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-gray-500"
        }`}
        onClick={() => {
          if (!disabled && !loading) {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
      >
        <input
          ref={inputRef}
          disabled={disabled || loading}
          value={
            searchable && open
              ? query || selectedOption?.[labelKey] || ""
              : selectedOption?.[labelKey] || ""
          }
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selectedOption ? "" : placeholder}
          readOnly={!searchable}
          className={`w-full text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              : "bg-white text-gray-800 dark:bg-transparent dark:text-gray-100"
          }`}
        />
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        )}
        {clearable && value && !disabled && !loading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
              setQuery("");
            }}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
        {!loading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                setOpen((p) => !p);
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }}
            className="flex items-center"
          >
            <ChevronIcon open={open} />
          </button>
        )}
      </div>

      {open && !disabled && !loading && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              {options.length === 0
                ? "No options available"
                : "No results found"}
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt[valueKey] === value;
              return (
                <div
                  key={opt[valueKey]}
                  onClick={() => {
                    onChange?.(opt[valueKey]);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`cursor-pointer px-3 py-2 text-sm transition ${
                    isSelected
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/40"
                  }`}
                >
                  {opt[labelKey]}
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DropdownField;
