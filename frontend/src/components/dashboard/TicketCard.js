"use client";

import React from "react";
import Badge from "../ui/Badge";
import { Warning, Smiley, SmileyMeh, SmileySad } from "@phosphor-icons/react";

export default function TicketCard({ ticket, isActive, onClick }) {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <Smiley size={16} className="text-emerald-400" weight="duotone" />;
      case "negative":
        return <SmileySad size={16} className="text-rose-400" weight="duotone" />;
      case "neutral":
        return <SmileyMeh size={16} className="text-slate-400" weight="duotone" />;
      default:
        return null;
    }
  };

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-slate-900/80 border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.1)]"
          : "bg-slate-950/20 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700/80"
      }`}
    >
      {/* Escalated Glow Line */}
      {ticket.escalated && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-violet-500 rounded-l-xl" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-indigo-400 tracking-wide uppercase">
          {ticket.category || "General"}
        </span>
        <span className="text-xs text-slate-500">{formattedDate}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white line-clamp-1 transition-colors">
        {ticket.title}
      </h3>

      {/* Customer and Sentiment */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="truncate font-medium">{ticket.customer?.name}</span>
        {ticket.sentiment && (
          <div className="flex items-center gap-1 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800">
            {getSentimentIcon(ticket.sentiment)}
            <span className="capitalize text-[10px] tracking-wide">{ticket.sentiment}</span>
          </div>
        )}
      </div>

      {/* Badges Footer */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <Badge variant={ticket.status}>{ticket.status}</Badge>
        <Badge variant={ticket.priority}>{ticket.priority}</Badge>
        {ticket.escalated && (
          <Badge variant="escalated" className="flex items-center gap-1">
            <Warning size={10} weight="fill" />
            Escalated
          </Badge>
        )}
      </div>
    </div>
  );
}
