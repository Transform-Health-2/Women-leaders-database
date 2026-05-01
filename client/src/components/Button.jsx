import React from "react";

const VARIANTS = {
  primary:   "bg-brand-orange text-white hover:bg-brand-orange-hover",
  secondary: "bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100",
  pink:      "bg-brand-pink text-white hover:bg-[#e04880]",
  ghost:     "bg-transparent text-brand-orange hover:underline",
};

const SIZES = {
  sm: "px-4 py-2 text-[1.3rem]",
  md: "px-6 py-3 text-[1.6rem]",
  lg: "px-8 py-4 text-[1.8rem]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
