"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ChevronRight, Check, Weight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeightTrackerProps {
  currentWeight?: number;
  onUpdate: (weight: number) => void;
}

export default function WeightTracker({ currentWeight, onUpdate }: WeightTrackerProps) {
  const [weight, setWeight] = useState(currentWeight?.toString() || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (currentWeight) setWeight(currentWeight.toString());
  }, [currentWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    if (!isNaN(numWeight)) {
      setIsUpdating(true);
      onUpdate(numWeight);

      // Artificial delay for feedback
      setTimeout(() => {
        setIsUpdating(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
      }, 500);
    }
  };

  return (
    <div className="rounded-[32px] bg-zinc-50 p-6 dark:bg-zinc-900/50 shadow-shallow-inner">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-zinc-800">
            <Scale className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Weight Log</h3>
            <p className="text-[10px] font-bold text-zinc-400">DAILY TRANSFORMATION</p>
          </div>
        </div>

        {currentWeight && (
          <div className="text-right">
            <div className="text-xl font-bold italic dark:text-white">{currentWeight}<span className="text-[10px] not-italic text-zinc-400 ml-1">kg</span></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter current weight..."
          className="w-full h-14 rounded-2xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-900 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-xs"
        />

        <button
          type="submit"
          disabled={!weight || isUpdating}
          className={cn(
            "absolute right-2 top-2 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            isSuccess
              ? "bg-emerald-500 text-white"
              : "bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-indigo-500"
          )}
        >
          <AnimatePresence mode="wait">
            {isUpdating ? (
              <motion.div
                key="updating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
            ) : isSuccess ? (
              <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Update
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </form>
    </div>
  );
}
