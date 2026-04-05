"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, Check } from "lucide-react";

interface DayDotGridProps {
  currentDay: number; // 0-75 (0 = challenge hasn't started yet)
  completedDays: number[]; // Array of completed day numbers
  entries?: { dayNumber: number; tasks: { isCompleted: boolean }[] }[];
  onDayClick?: (day: number) => void;
}

export default function DayDotGrid({
  currentDay,
  completedDays,
  entries = [],
  onDayClick,
}: DayDotGridProps) {
  // 🛡️ Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  // Helper: check if a day has all tasks checked
  const isDayAllTasksChecked = (day: number): boolean => {
    const entry = entries.find(e => e.dayNumber === day);
    if (!entry || !entry.tasks || entry.tasks.length === 0) return false;
    return entry.tasks.every(t => t.isCompleted);
  };

  // Helper: check if a day is "failed" (past day, not completed via completeDay)
  const isDayIncomplete = (day: number): boolean => {
    if (day >= currentDay) return false; // Not a past day
    if (completedDays.includes(day)) return false; // Was completed
    // It's a past day that wasn't completed — show X
    return true;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-5 gap-3 md:grid-cols-15 sm:grid-cols-10"
    >
      {days.map((day) => {
        const isCompleted = completedDays.includes(day);
        const isCurrent = day === currentDay;
        // Days are unlocked based on device date, not on completion
        // currentDay = 0 means challenge hasn't started — everything is locked
        const isLocked = currentDay === 0 || day > currentDay;
        const isIncomplete = isDayIncomplete(day);
        const isClickable = !isLocked;

        return (
          <motion.button
            key={day}
            variants={item}
            whileHover={{
              scale: isClickable ? 1.25 : 1,
              rotate: isClickable ? 5 : 0,
              zIndex: 10,
            }}
            whileTap={{ scale: isClickable ? 0.9 : 1 }}
            onClick={() => isClickable && onDayClick?.(day)}
            className={cn(
              "relative group flex aspect-square h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all duration-300 md:h-8 md:w-8 md:text-xs",
              // Completed days: green
              isCompleted &&
                "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-950/40",
              // Current active day: glowing border
              isCurrent &&
                !isCompleted &&
                "border-2 border-emerald-500 bg-white text-emerald-600 shadow-[0_0_20px_-2px_rgba(16,185,129,0.5)] dark:bg-zinc-900 dark:text-emerald-400",
              // Incomplete past day (X): red-ish styling
              isIncomplete &&
                !isCompleted &&
                "bg-red-50 text-red-400 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50",
              // Locked future days
              isLocked &&
                "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed grayscale opacity-30",
              // Normal unlocked, non-completed, non-incomplete, non-current
              !isCompleted &&
                !isCurrent &&
                !isLocked &&
                !isIncomplete &&
                "bg-white text-zinc-600 border border-zinc-200 hover:border-emerald-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700"
            )}
          >
            {isLocked ? (
              <span className="text-[12px] opacity-20">🔒</span>
            ) : isCompleted ? (
              <Check className="h-3 w-3 md:h-4 md:w-4 stroke-[3px]" />
            ) : isIncomplete ? (
              <X className="h-3 w-3 md:h-4 md:w-4 stroke-[3px] text-red-400" />
            ) : (
              day
            )}

            {isCurrent && !isCompleted && (
              <motion.span
                layoutId="current-glow"
                className="absolute inset-0 rounded-full bg-emerald-500/20"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 0.1, 0.6],
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
    </motion.div>
  );
}
