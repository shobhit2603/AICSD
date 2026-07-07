"use client";

import React from "react";
import {
  PlusCircle,
  Clock,
  Note,
  ChatCircle,
  Sparkle,
  Tag,
  ShieldWarning,
  Smiley,
  Warning,
  Gear,
} from "@phosphor-icons/react";

export default function ActivityLogView({ activityLog = [] }) {
  const getActionIcon = (action) => {
    switch (action) {
      case "ticket_created":
        return <PlusCircle size={14} className="text-emerald-400" weight="fill" />;
      case "status_changed":
        return <Clock size={14} className="text-indigo-400" weight="fill" />;
      case "priority_changed":
        return <Warning size={14} className="text-orange-400" weight="fill" />;
      case "note_added":
        return <Note size={14} className="text-amber-400" weight="fill" />;
      case "message_sent":
        return <ChatCircle size={14} className="text-sky-400" weight="fill" />;
      case "ai_summary_generated":
      case "ai_reply_suggested":
        return <Sparkle size={14} className="text-violet-400" weight="fill" />;
      case "ai_categorized":
        return <Tag size={14} className="text-cyan-400" weight="fill" />;
      case "ai_escalation_checked":
        return <ShieldWarning size={14} className="text-pink-400" weight="fill" />;
      case "sentiment_updated":
        return <Smiley size={14} className="text-emerald-400" weight="fill" />;
      case "escalated":
        return <Warning size={14} className="text-rose-400" weight="fill" />;
      default:
        return <Gear size={14} className="text-slate-400" />;
    }
  };

  const getActionBg = (action) => {
    switch (action) {
      case "ticket_created":
        return "bg-emerald-50 border-emerald-200";
      case "status_changed":
        return "bg-blue-50 border-blue-200";
      case "priority_changed":
        return "bg-orange-50 border-orange-200";
      case "note_added":
        return "bg-amber-50 border-amber-200";
      case "message_sent":
        return "bg-sky-50 border-sky-200";
      case "ai_summary_generated":
      case "ai_reply_suggested":
      case "ai_categorized":
      case "ai_escalation_checked":
        return "bg-violet-50 border-violet-200";
      case "escalated":
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm p-5">
      <h3 className="text-xs font-semibold text-brand-black uppercase tracking-wider mb-4 select-none">
        Timeline & Activity Log
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 relative min-h-0">
        {activityLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Clock size={24} className="text-slate-600 mb-2" />
            <span className="text-xs text-slate-500">No activity logged for this ticket.</span>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-slate-200 flex flex-col gap-6 ml-2 py-1">
            {[...activityLog].reverse().map((log, i) => (
              <div key={log._id || i} className="relative flex flex-col gap-1.5 text-xs">
                {/* Timeline Dot Icon */}
                <div
                  className={`absolute left-[-35px] top-0 p-1.5 rounded-full border ${getActionBg(
                    log.action
                  )} flex items-center justify-center bg-white`}
                >
                  {getActionIcon(log.action)}
                </div>

                {/* Log Header */}
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 select-none">
                  <span className="font-semibold capitalize text-brand-black">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span>
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Log Details */}
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-normal">
                  {log.details}
                </p>

                {/* Performed By Badge */}
                <span className="text-[9px] text-slate-500 self-start select-none">
                  Action performed by: <span className="text-brand-black capitalize">{log.performedBy}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
