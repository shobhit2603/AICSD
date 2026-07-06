import React from "react";
import { twMerge } from "tailwind-merge";

export default function Textarea({ className, ...props }) {
  return (
    <textarea
      className={twMerge(
        "flex min-h-[80px] w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none",
        className
      )}
      {...props}
    />
  );
}
