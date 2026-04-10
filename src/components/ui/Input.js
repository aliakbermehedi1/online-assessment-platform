export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  rightElement,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#6B3FE7] focus:ring-2 focus:ring-purple-100 transition-all ${error ? "border-red-400" : ""} ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
