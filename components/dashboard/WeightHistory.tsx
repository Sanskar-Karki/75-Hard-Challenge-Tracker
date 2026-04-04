"use client";

import { DayEntry } from "@/types";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightHistoryProps {
  entries: DayEntry[];
}

export default function WeightHistory({ entries }: WeightHistoryProps) {
  // Sort entries by day number descending
  const sortedEntries = [...entries]
    .filter(e => e.weight !== undefined)
    .sort((a, b) => b.dayNumber - a.dayNumber);

  return (
    <div className="rounded-[32px] bg-white border border-zinc-100 p-6 dark:bg-zinc-900 dark:border-zinc-800 shadow-shallow-inner">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50 italic">Weight <span className="text-indigo-500">History</span></h3>
        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-full dark:bg-zinc-800">{sortedEntries.length} Logs</span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedEntries.length === 0 ? (
          <div className="py-10 text-center text-zinc-400 font-bold italic text-xs">
            No weigh-ins logged yet.
          </div>
        ) : (
          sortedEntries.map((entry, idx) => {
            const prevEntry = sortedEntries[idx + 1];
            const diff = prevEntry && entry.weight && prevEntry.weight
              ? (entry.weight - prevEntry.weight).toFixed(1)
              : null;

            return (
              <motion.div
                key={entry.dayNumber}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[10px] font-black shadow-sm dark:bg-zinc-400">
                    {entry.dayNumber}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold dark:text-white">{entry.weight} kg</span>
                  </div>
                </div>

                {diff !== null && (
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black italic",
                    parseFloat(diff) < 0 ? "text-emerald-500" :
                      parseFloat(diff) > 0 ? "text-red-500" : "text-zinc-400"
                  )}>
                    {parseFloat(diff) < 0 ? <TrendingDown className="h-3 w-3" /> :
                      parseFloat(diff) > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {diff > "0" ? `+${diff}` : diff}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f4f4f5;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
        }
      `}</style>
    </div>
  );
}
