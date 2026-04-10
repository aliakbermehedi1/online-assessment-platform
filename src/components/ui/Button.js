export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
}) {
  const base =
    "px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer";
  const variants = {
    primary: "bg-[#6B3FE7] hover:bg-[#5a33c4] text-white",
    outline:
      "border-2 border-[#6B3FE7] text-[#6B3FE7] hover:bg-purple-50 bg-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "text-gray-500 hover:bg-gray-100 bg-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
