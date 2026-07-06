import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const badgeVariants = {
  // Statuses
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  resolved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  
  // Priorities
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  urgent: "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse",
  
  // Sentiments
  positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  negative: "bg-rose-500/10 text-rose-400 border-rose-500/20",

  // Categories
  billing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  technical: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  account: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  shipping: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  general: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  other: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",

  // Misc
  escalated: "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_8px_rgba(139,92,246,0.15)]",
  default: "bg-slate-800 text-slate-200 border-slate-700",
};

export default function Badge({ children, variant = "default", className, ...props }) {
  const badgeStyle = badgeVariants[variant.toLowerCase()] || badgeVariants.default;
  
  return (
    <span
      className={twMerge(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider",
        badgeStyle,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
