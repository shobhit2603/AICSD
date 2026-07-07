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

  // Styling based on mockup: white background, specific colored borders
  const kpis = [
    {
      title: "Active Tickets",
      value: openCount,
      sub: `${byStatus["open"] || 0} Open / ${byStatus["in-progress"] || 0} In Progress`,
      icon: Ticket,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-400",
      glow: "shadow-sm",
    },
    {
      title: "Resolved Tickets",
      value: resolvedCount,
      sub: `Closed: ${byStatus["closed"] || 0}`,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-400",
      glow: "shadow-sm",
    },
    {
      title: "Escalated Cases",
      value: escalatedCount,
      sub: "Needs urgent intervention",
      icon: WarningOctagon,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-400",
      glow: "shadow-sm",
    },
    {
      title: "Customer Sentiment",
      value: `${positiveRatio}%`,
      sub: "Positive feedback score",
      icon: Smiley,
      color: "text-brand-blue",
      bg: "bg-blue-50",
      border: "border-blue-400",
      glow: "shadow-sm",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse bg-white border-slate-200 h-24" />
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
            className={`flex items-center justify-between border-2 ${kpi.border} bg-white hover:-translate-y-0.5 transition-all duration-300 rounded-xl ${kpi.glow} px-5 py-4`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500">{kpi.title}</span>
              <span className="text-3xl font-semibold text-slate-800">{kpi.value}</span>
              <span className="text-xs text-slate-400">{kpi.sub}</span>
            </div>
            {/* <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <IconComponent size={24} weight="duotone" />
            </div> */}
          </Card>
        );
      })}
    </div>
  );
}

