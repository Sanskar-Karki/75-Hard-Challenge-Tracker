"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DayDotGridProps {
  currentDay: number; // 1-75
  completedDays: number[]; // Array of completed day numbers
  onDayClick?: (day: number) => void;
}

export default function DayDotGrid({
  currentDay,
  completedDays,
  onDayClick,
}: DayDotGridProps) {
  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-3 md:grid-cols-15 sm:grid-cols-10">
      {days.map((day) => {
        const isCompleted = completedDays.includes(day);
        const isCurrent = day === currentDay;
        const isLocked = day > currentDay;

        return (
          <motion.button
            key={day}
            whileHover={{ scale: isLocked ? 1 : 1.15 }}
            whileTap={{ scale: isLocked ? 1 : 0.95 }}
            onClick={() => !isLocked && onDayClick?.(day)}
            className={cn(
              "relative group flex aspect-square h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 md:h-8 md:w-8 md:text-xs",
              isCompleted && "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/20",
              isCurrent && "border-2 border-emerald-500 bg-white text-emerald-600 shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)] dark:bg-zinc-900 dark:text-emerald-400",
              isLocked && "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed grayscale opacity-30",
              !isCompleted && !isCurrent && !isLocked && "bg-white text-zinc-600 border border-zinc-200 hover:border-emerald-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700"
            )}
          >
            {isLocked ? (
              <span className="text-[16px] opacity-40">🔒</span>
            ) : day}

            {isCurrent && (
              <motion.span
                layoutId="current-glow"
                className="absolute inset-0 rounded-full bg-emerald-500/20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
