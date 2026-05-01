import React from "react";

export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[1.3rem] font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`w-full border rounded-lg px-4 py-3 text-[1.4rem] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:ring-2 focus:ring-brand-navy focus:border-transparent ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"} ${className}`}
        {...props}
      />
      {error && <p className="text-[1.2rem] text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[1.3rem] font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={`w-full border rounded-lg px-4 py-3 text-[1.4rem] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:ring-2 focus:ring-brand-navy focus:border-transparent resize-none ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"} ${className}`}
        {...props}
      />
      {error && <p className="text-[1.2rem] text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[1.3rem] font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`w-full border rounded-lg px-4 py-3 text-[1.4rem] text-gray-900 outline-none transition-colors focus:ring-2 focus:ring-brand-navy focus:border-transparent bg-white ${error ? "border-red-400" : "border-gray-300"} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[1.2rem] text-red-500">{error}</p>}
    </div>
  );
}
