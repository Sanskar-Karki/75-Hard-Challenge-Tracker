"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { renderTaskIcon } from "@/lib/task-icons";

export interface TaskItem {
  id: string;
  label: string;
  iconId: string;
  completed: boolean;
}

interface TaskChecklistProps {
  dayNumber: number;
  initialTasks?: TaskItem[];
  onTaskToggle?: (taskId: string, isCompleted: boolean) => void;
  onComplete?: () => void;
}

const DEFAULT_TASKS: TaskItem[] = [
  { id: "water", label: "Drink 1 Gallon Water", iconId: "droplet", completed: false },
  { id: "diet", label: "Follow Diet (No Cheat Meals)", iconId: "utensils", completed: false },
  { id: "workout1", label: "Outdoor Workout (45 min)", iconId: "dumbbell", completed: false },
  { id: "workout2", label: "Indoor Workout (45 min)", iconId: "dumbbell", completed: false },
  { id: "reading", label: "Read 10 Pages", iconId: "book", completed: false },
];

export default function TaskChecklist({
  dayNumber,
  initialTasks = DEFAULT_TASKS,
  onTaskToggle,
  onComplete,
}: TaskChecklistProps) {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = (completedCount / tasks.length) * 100;
  const allCompleted = completedCount === tasks.length;

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    onTaskToggle?.(id, newCompleted);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
  };


  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">Day {dayNumber}</h2>
          <p className="text-sm text-zinc-500">{tasks.length - completedCount} tasks remaining today</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 sm:h-12 sm:w-12">
          <span className="text-lg font-bold sm:text-xl">{Math.round(progressPercent)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800 shadow-inner">
        {/* Main Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full z-10"
        >
          {/* Subtle Shimmer */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[progress-stripe_1s_linear_infinite]" />

          {/* Edge Sparkle */}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-sm rounded-full"
          />
        </motion.div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.button
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-2xl p-3 transition-all duration-300 cursor-pointer sm:gap-4 sm:rounded-3xl sm:p-4",
              task.completed
                ? "bg-zinc-50 dark:bg-zinc-900/50"
                : "bg-white border border-zinc-100 hover:border-emerald-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
            )}
          >
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-10 sm:w-10 sm:rounded-2xl",
              task.completed ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
            )}>
              {task.completed ? <Check className="w-5 h-5 stroke-[3px]" /> : renderTaskIcon(task.iconId)}
            </div>

            <div className="flex flex-1 items-center justify-between overflow-hidden">
              <span className={cn(
                "text-left font-medium truncate transition-all",
                task.completed ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-700 dark:text-zinc-300"
              )}>
                {task.label}
              </span>

              <div className={cn(
                "h-6 w-6 rounded-lg border-2 transition-all",
                task.completed
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-zinc-200 group-hover:border-emerald-300 dark:border-zinc-700"
              )}>
                {task.completed && <Check className="w-4 h-4 text-white p-0.5" />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {allCompleted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-zinc-950 py-4 text-base font-bold text-white shadow-xl shadow-zinc-200 transition-all dark:bg-emerald-600 dark:shadow-emerald-900/20 cursor-pointer sm:py-5 sm:text-lg"
          >
            Complete Day {dayNumber} 🎉
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
