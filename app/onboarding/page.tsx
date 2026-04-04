"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Zap, Target, Trophy } from "lucide-react";
import { use75Hard } from "@/hooks/use-75hard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const { startChallenge } = use75Hard();
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const router = useRouter();

  const handleStart = () => {
    startChallenge(startDate);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 dark:bg-black">
      <div className="w-full max-w-xl space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-zinc-950 text-white shadow-2xl dark:bg-emerald-500"
          >
            <Zap className="h-8 w-8 fill-current" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">INITIALIZE PHASE</h1>
          <p className="text-zinc-500 max-w-sm mx-auto">Select your official start date. Once initialized, the timeline syncs with your device clock.</p>
        </div>

        <div className="rounded-[40px] bg-white p-10 border border-zinc-100 shadow-xl shadow-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-16 rounded-[24px] border-2 border-zinc-100 bg-zinc-50 pl-16 pr-6 text-lg font-bold outline-none ring-zinc-950 transition-all focus:border-zinc-950 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-3xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-emerald-500">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Duration</p>
                  <p className="text-sm font-bold">75 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-emerald-500">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Goal</p>
                  <p className="text-sm font-bold">Unstoppable</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="group flex w-full h-16 items-center justify-center gap-3 rounded-[24px] bg-zinc-950 text-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-emerald-600"
            >
              Start Challenge
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          DISCIPLINE OVER MOTIVATION
        </p>
      </div>
    </div>
  );
}
