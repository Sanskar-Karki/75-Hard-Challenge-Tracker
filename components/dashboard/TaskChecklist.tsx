"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Droplets, Utensils, Dumbbell, BookOpen, Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TaskItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface TaskChecklistProps {
  dayNumber: number;
  initialTasks?: TaskItem[];
  onTaskToggle?: (taskId: string, isCompleted: boolean) => void;
  onComplete?: () => void;
}

const DEFAULT_TASKS = [
  { id: "water", label: "Drink 1 Gallon Water", icon: <Droplets className="w-5 h-5 text-blue-500" />, completed: false },
  { id: "diet", label: "Follow Diet (No Cheat Meals)", icon: <Utensils className="w-5 h-5 text-emerald-500" />, completed: false },
  { id: "workout1", label: "Outdoor Workout (45 min)", icon: <Dumbbell className="w-5 h-5 text-orange-500" />, completed: false },
  { id: "workout2", label: "Second Workout (45 min)", icon: <Dumbbell className="w-5 h-5 text-purple-500" />, completed: false },
  { id: "reading", label: "Read 10 Pages", icon: <BookOpen className="w-5 h-5 text-amber-500" />, completed: false },
  { id: "photo", label: "Take Progress Picture", icon: <Camera className="w-5 h-5 text-rose-500" />, completed: false },
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
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Day {dayNumber}</h2>
          <p className="text-sm text-zinc-500">{tasks.length - completedCount} tasks remaining today</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          <span className="text-xl font-bold">{Math.round(progressPercent)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
        />
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
              "group relative flex w-full items-center gap-4 rounded-3xl p-4 transition-all duration-300",
              task.completed 
                ? "bg-zinc-50 dark:bg-zinc-900/50" 
                : "bg-white border border-zinc-100 hover:border-emerald-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
              task.completed ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
            )}>
              {task.completed ? <Check className="w-5 h-5 stroke-[3px]" /> : task.icon}
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
            className="flex w-full items-center justify-center gap-3 rounded-full bg-zinc-950 py-5 text-lg font-bold text-white shadow-xl shadow-zinc-200 transition-all dark:bg-emerald-600 dark:shadow-emerald-900/20"
          >
            Complete Day {dayNumber} 🎉
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
