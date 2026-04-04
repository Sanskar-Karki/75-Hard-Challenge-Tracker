"use client";

import { useMemo } from "react";
import { DayEntry } from "@/types";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightSummaryWidgetProps {
  entries: DayEntry[];
}

export default function WeightSummaryWidget({ entries }: WeightSummaryWidgetProps) {
  const sortedEntries = useMemo(() => {
    return [...entries]
      .filter(e => e.weight !== undefined)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }, [entries]);

  const stats = useMemo(() => {
    if (sortedEntries.length === 0) return null;
    
    const startWeight = sortedEntries[0].weight || 0;
    const currentWeight = sortedEntries[sortedEntries.length - 1].weight || 0;
    const diff = currentWeight - startWeight;
    
    return {
      current: currentWeight,
      diff: diff.toFixed(1),
      isLoss: diff < 0,
      isGain: diff > 0,
    };
  }, [sortedEntries]);

  if (!stats) return null;

  return (
    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 shadow-shallow-inner h-11 transition-all hover:bg-white dark:hover:bg-zinc-800 group">
      <div className="flex flex-col items-end">
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Current Weight</span>
        <div className="flex items-center gap-1">
           {stats.isLoss ? (
             <TrendingDown className="h-3 w-3 text-emerald-500 animate-pulse" />
           ) : stats.isGain ? (
             <TrendingUp className="h-3 w-3 text-red-500 animate-pulse" />
           ) : (
             <Minus className="h-3 w-3 text-zinc-400 opacity-50" />
           )}
           <span className="text-sm font-black italic dark:text-zinc-50">{stats.current} <span className="text-[8px] not-italic text-zinc-500">kg</span></span>
        </div>
      </div>
      
      <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700 mx-1" />

      <div className="flex flex-col items-start translate-y-[1px]">
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Total Diff</span>
        <span className={cn(
          "text-[10px] font-black italic rounded-full px-1.5 py-0.5",
          stats.isLoss ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : 
          stats.isGain ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : 
          "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
        )}>
          {parseFloat(stats.diff) > 0 ? `+${stats.diff}` : stats.diff} kg
        </span>
      </div>

      {/* Tiny Graphic Sparkline Mockup (Simple SVG) */}
      <div className="w-8 ml-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 100 100" className="w-full h-4 overflow-visible">
          <path
            d="M 0 80 Q 25 20, 50 60 T 100 40"
            fill="none"
            stroke="#6366f1"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
