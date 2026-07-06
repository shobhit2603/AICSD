import React from "react";
import { twMerge } from "tailwind-merge";

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={twMerge(
        "rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-lg p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
