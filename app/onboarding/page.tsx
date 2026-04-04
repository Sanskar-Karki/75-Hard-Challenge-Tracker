"use client";

import { motion } from "framer-motion";
import { Zap, Calendar, Target, Trophy, ChevronRight } from "lucide-react";
import { use75Hard } from "@/hooks/use-75hard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CalendarPicker from "@/components/ui/CalendarPicker";

export default function OnboardingPage() {
  const { startChallenge } = use75Hard();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  const handleStart = async () => {
    if (!user) return;
    await startChallenge(selectedDate.toISOString(), user.id);
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-6 dark:bg-black overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[10%] h-[30%] w-[30%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[20%] w-[20%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Compact Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-lg dark:bg-emerald-500">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tight text-zinc-900 dark:text-zinc-50 uppercase leading-none">Initialize Phase</h1>
              <p className="mt-0.5 text-[10px] text-zinc-500 font-medium">Hello {user?.firstName || "Warrior"}, pick your start date.</p>
            </div>
          </div>

          {/* Compact Mission Card */}
          <div className="bg-zinc-50 border border-zinc-200/50 rounded-[24px] p-4 space-y-4 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-xl shadow-zinc-200/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-zinc-100 w-fit mx-auto dark:bg-zinc-800 dark:border-zinc-700 shadow-sm">
                <Calendar className="h-2.5 w-2.5 text-emerald-500" />
                <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">Target: {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <div className="bg-white rounded-xl p-2 dark:bg-zinc-950/30">
                <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 py-2 border-y border-zinc-200/50 dark:border-zinc-800">
              <div className="text-center border-r border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="text-base font-bold italic dark:text-white">75</div>
                <div className="text-[7px] font-medium text-zinc-400">DAYS</div>
              </div>
              <div className="text-center border-r border-zinc-100 dark:border-zinc-800 last:border-0">
                <div className="text-base font-bold italic dark:text-white">6</div>
                <div className="text-[7px] font-medium text-zinc-400">TASKS</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold italic dark:text-white">0</div>
                <div className="text-[7px] font-medium text-zinc-400">CHEATS</div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="group relative flex w-full h-12 items-center justify-center gap-3 rounded-full bg-zinc-950 text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] overflow-hidden dark:bg-emerald-500"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              START MISSION
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="flex justify-center gap-6 text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Target className="h-2.5 w-2.5" />
              <span className="text-[7px] font-bold uppercase tracking-widest">Focus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-2.5 w-2.5" />
              <span className="text-[7px] font-bold uppercase tracking-widest">Victory</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
