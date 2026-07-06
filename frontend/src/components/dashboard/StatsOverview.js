"use client";

import React from "react";
import Card from "../ui/Card";
import { Ticket, CheckCircle, WarningOctagon, Smiley } from "@phosphor-icons/react";

export default function StatsOverview({ stats, isLoading }) {
  const byStatus = stats?.byStatus || {};
  const bySentiment = stats?.bySentiment || {};
  
  const openCount = (byStatus["open"] || 0) + (byStatus["in-progress"] || 0);
  const resolvedCount = (byStatus["resolved"] || 0) + (byStatus["closed"] || 0);
  const escalatedCount = stats?.totalEscalated || 0;
  
  const positiveSentiment = bySentiment["positive"] || 0;
  const totalSentiment = Object.values(bySentiment).reduce((a, b) => a + b, 0) || 1;
  const positiveRatio = Math.round((positiveSentiment / totalSentiment) * 100);

  const kpis = [
    {
      title: "Active Tickets",
      value: openCount,
      sub: `${byStatus["open"] || 0} Open / ${byStatus["in-progress"] || 0} In Progress`,
      icon: Ticket,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/10",
      glow: "shadow-indigo-500/5",
    },
    {
      title: "Resolved Tickets",
      value: resolvedCount,
      sub: `Closed: ${byStatus["closed"] || 0}`,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/10",
      glow: "shadow-emerald-500/5",
    },
    {
      title: "Escalated Cases",
      value: escalatedCount,
      sub: "Needs urgent intervention",
      icon: WarningOctagon,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/10",
      glow: "shadow-violet-500/5",
    },
    {
      title: "Customer Sentiment",
      value: `${positiveRatio}%`,
      sub: "Positive feedback score",
      icon: Smiley,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/10",
      glow: "shadow-amber-500/5",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse bg-slate-900/20 border-slate-800 h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <Card
            key={idx}
            className={`flex items-center justify-between border ${kpi.border} bg-slate-950/45 hover:bg-slate-900/40 hover:-translate-y-0.5 transition-all duration-300 shadow-md ${kpi.glow}`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{kpi.title}</span>
              <span className="text-2xl font-bold text-slate-100">{kpi.value}</span>
              <span className="text-xs text-slate-500">{kpi.sub}</span>
            </div>
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <IconComponent size={24} weight="duotone" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
