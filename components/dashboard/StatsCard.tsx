"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  subValue?: string;
  variant?: 'streak' | 'default';
  className?: string;
}

export default function StatsCard({ 
  label, 
  value, 
  icon, 
  trend, 
  subValue, 
  variant = 'default',
  className 
}: StatsCardProps) {
  const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value;
  
  // 🛡️ Dynamic Evolving Styles for Streaks
  const isStreak = variant === 'streak';
  const isLevel1 = isStreak && numericValue <= 10;
  const isLevel2 = isStreak && numericValue > 10 && numericValue <= 30;
  const isLevel3 = isStreak && numericValue > 30 && numericValue <= 60;
  const isLevel4 = isStreak && numericValue > 60;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-[28px] p-5 transition-all duration-500 sm:rounded-[40px] sm:p-6",
      "shadow-shallow-inner dark:border-zinc-800/50",
      variant === 'default' ? "bg-white dark:bg-zinc-950/40 dark:border" : "",
      // 🔥 Level 1 (Rookie): Warm Amber
      isLevel1 && "bg-amber-50/50 dark:bg-amber-500/5 border-2 border-amber-500/20",
      // 🔥 Level 2 (Warrior): Crimson Heat
      isLevel2 && "bg-rose-50/80 dark:bg-rose-500/10 border-2 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]",
      // 🔥 Level 3 (Elite): Amethyst Glow
      isLevel3 && "bg-violet-50/80 dark:bg-violet-500/10 border-2 border-violet-500/40 shadow-[0_0_35px_rgba(139,92,246,0.15)]",
      // 🔥 Level 4 (Legend): Indigo Nova
      isLevel4 && "bg-indigo-50 dark:bg-indigo-500/20 border-2 border-indigo-500/60 shadow-[0_0_40px_rgba(99,102,241,0.3)] animate-pulse-subtle",
      className
    )}>
      {/* 🏙️ Backdrop Dynamic Title */}
      {isStreak && (
        <div className="absolute -right-4 -top-2 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
          <span className="text-6xl font-black italic uppercase tracking-tighter">
            {isLevel1 ? 'Rookie' : isLevel2 ? 'Warrior' : isLevel3 ? 'Elite' : 'Legend'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={cn(
          "p-3 rounded-2xl transition-colors duration-500",
          isLevel1 ? "bg-amber-100 dark:bg-amber-500/20" : 
          isLevel2 ? "bg-rose-100 dark:bg-rose-500/30" : 
          isLevel3 ? "bg-violet-100 dark:bg-violet-500/40" : 
          isLevel4 ? "bg-indigo-100 dark:bg-indigo-500/40" : 
          "bg-zinc-50 dark:bg-zinc-900/50"
        )}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-black italic px-3 py-1 rounded-full uppercase tracking-widest",
            (isLevel3 || isLevel4) ? "bg-indigo-500 text-white" : "bg-emerald-500/10 text-emerald-500"
          )}>
            {trend}
          </span>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className={cn(
          "text-3xl font-black italic uppercase tracking-tighter transition-all duration-500",
          isLevel1 ? "text-amber-600 dark:text-amber-400" :
          isLevel2 ? "text-rose-600 dark:text-rose-400" :
          isLevel3 ? "text-violet-600 dark:text-violet-400" :
          isLevel4 ? "text-indigo-600 dark:text-indigo-400 scale-110 origin-left" :
          "text-zinc-900 dark:text-zinc-50"
        )}>
          {value}
        </p>
        {(subValue || isStreak) && (
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">
            {isStreak ? (
              isLevel1 ? "⚡ STARTING STRONG" : 
              isLevel2 ? "🔥 WARRIOR STATUS" : 
              isLevel3 ? "🏹 ELITE DISCIPLINE" :
              "💠 UNSTOPPABLE LEGEND"
            ) : subValue}
          </p>
        )}
      </div>
    </div>
  );
}

export function DetailedProgress({ totalDays, completedDays }: { totalDays: number, completedDays: number }) {
  const percent = Math.round((completedDays / totalDays) * 100);
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-500">Overall Progress</p>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">{percent}% <span className="text-base font-medium text-zinc-400 sm:text-lg">Completed</span></h2>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Day {completedDays} of {totalDays}</p>
        </div>
      </div>
      
      <div className="relative h-3.5 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800 shadow-inner sm:h-4">
        {/* Main Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full z-10"
        >
           {/* Animated Shimmer Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:32px_32px] animate-[progress-stripe_1s_linear_infinite]" />
           
           {/* Leading Edge Glow */}
           <motion.div 
             animate={{ 
               opacity: [0.4, 0.8, 0.4],
               scaleY: [1, 1.2, 1]
             }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-md rounded-full" 
           />
        </motion.div>
        
        {/* Background Depth Shadow */}
        <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
