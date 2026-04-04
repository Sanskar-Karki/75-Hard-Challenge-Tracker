"use client";

import { motion } from "framer-motion";
import { Flame, Target, Calendar, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export default function StatsCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col gap-4 rounded-[32px] bg-white p-6 shadow-sm border border-zinc-100 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-zinc-950",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-zinc-950 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-emerald-500/20 dark:group-hover:text-emerald-400">
          {icon}
        </div>
        {trend && (
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full dark:bg-emerald-950/30 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <h3 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</h3>
      </div>
    </motion.div>
  );
}

export function DetailedProgress({ totalDays, completedDays }: { totalDays: number, completedDays: number }) {
  const percent = Math.round((completedDays / totalDays) * 100);
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-500">Overall Progress</p>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{percent}% <span className="text-lg font-medium text-zinc-400">Completed</span></h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Day {completedDays} of {totalDays}</p>
        </div>
      </div>
      
      <div className="relative h-4 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[progress-stripe_1s_linear_infinite]" />
      </div>
    </div>
  );
}
