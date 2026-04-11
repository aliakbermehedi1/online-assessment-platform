"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  touched,
  type = "date",
  minDate,
  maxDate,
  className = "",
}) => {
  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange?.({ target: { name, value: date } })}
        onBlur={onBlur}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat={
          type === "time"
            ? "hh:mm aa"
            : type === "datetime"
              ? "dd/MM/yyyy hh:mm aa"
              : "dd/MM/yyyy"
        }
        placeholderText={
          type === "time"
            ? "hh:mm AM"
            : type === "datetime"
              ? "DD/MM/YYYY hh:mm AM"
              : "DD/MM/YYYY"
        }
        showTimeSelect={type !== "date"}
        showTimeSelectOnly={type === "time"}
        timeFormat="hh:mm aa"
        timeIntervals={1}
        timeCaption="Time"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={70}
        scrollableYearDropdown
        popperClassName="datepicker-popper"
        wrapperClassName="w-full"
        className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 transition-all duration-200 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:disabled:bg-gray-800"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DateField;
