import React from "react";
import { twMerge } from "tailwind-merge";

export default function Select({ children, className, ...props }) {
  return (
    <select
      className={twMerge(
        "flex w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
