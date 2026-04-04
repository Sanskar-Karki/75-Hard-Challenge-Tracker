"use client";

import { motion } from "framer-motion";
import { Flame, Target, Calendar, Trophy, Zap, Share2, Droplets, Utensils, Dumbbell, BookOpen, Camera } from "lucide-react";
import { use75Hard } from "@/hooks/use-75hard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DayDotGrid from "@/components/dashboard/DayDotGrid";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import StatsCard, { DetailedProgress } from "@/components/dashboard/StatsCard";
import { UserButton, useUser, Show } from "@clerk/nextjs";
import confetti from "canvas-confetti";

export default function DashboardPage() {
  const { currentChallenge, lastCompletedDay, getCurrentDay, completeDay, updateTask, resetChallenge, fetchChallenge, isLoading, hasFetched } = use75Hard();
  const { user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      fetchChallenge(user.id);
    }
  }, [user?.id, fetchChallenge]);

  useEffect(() => {
    if (mounted && !currentChallenge && !isLoading && hasFetched) {
      router.push("/onboarding");
    }
  }, [currentChallenge, mounted, isLoading, hasFetched, router]);

  if (!mounted || isLoading || !hasFetched) {

    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!currentChallenge) return null;


  const currentDay = getCurrentDay();
  const workingDay = Math.min(lastCompletedDay + 1, currentDay);
  const currentDayEntry = currentChallenge.entries.find(e => e.dayNumber === workingDay);
  const completedDays = currentChallenge.entries.filter(e => e.isDayCompleted).map(e => e.dayNumber);

  const handleComplete = () => {
    // Basic validation to ensure we're completing the right day sequentially
    if (workingDay === lastCompletedDay + 1) {
      completeDay(workingDay);
      
      // Party boomer!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#6ee7b7", "#ffffff"]
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  return (
    <div className="min-h-screen bg-zinc-50 pb-20 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-emerald-500">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">75 Hard <span className="text-emerald-500 italic">Tracker</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
              <Share2 className="h-5 w-5" />
            </button>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-12">
        {/* Progress Section */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <DetailedProgress totalDays={75} completedDays={lastCompletedDay} />
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatsCard 
                label="Current Streak" 
                value={`${lastCompletedDay} Days`} 
                icon={<Flame className="h-6 w-6" />} 
                trend="+1 Today"
              />
              <StatsCard 
                label="Consistency" 
                value={`${Math.round((lastCompletedDay / currentDay) * 100) || 0}%`} 
                icon={<Target className="h-6 w-6" />} 
              />
              <StatsCard 
                label="Days Left" 
                value={75 - lastCompletedDay} 
                icon={<Calendar className="h-6 w-6" />} 
                className="hidden sm:flex"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[32px] bg-zinc-900 p-8 text-white shadow-2xl dark:bg-emerald-950/20 dark:border dark:border-emerald-500/20">
            <div className="space-y-4">
              <Trophy className="h-10 w-10 text-emerald-400" />
              <h3 className="text-2xl font-bold italic uppercase">Mindset is everything.</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                {workingDay < currentDay ? (
                  <span className="text-orange-400 font-bold">CATCHING UP: DAY {workingDay} OF {currentDay}</span>
                ) : (
                  <>Welcome back, {user?.firstName || "Warrior"}. Today is Day {currentDay}. Don't let your future self down.</>
                )}
              </p>
            </div>
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to restart? All progress will be lost.")) {
                  resetChallenge();
                  router.push("/onboarding");
                }
              }}
              className="mt-8 text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-all"
            >
              Restart Challenge
            </button>
          </div>
        </section>

        <hr className="border-zinc-100 dark:border-zinc-800" />

        {/* 75 Days Grid */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">75 Day Roadmap</h2>
            <p className="text-sm text-zinc-500 font-medium">Unlocked based on device time & consistency.</p>
          </div>
          <div className="rounded-[40px] bg-white p-8 border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <DayDotGrid 
              currentDay={currentDay} 
              completedDays={completedDays} 
            />
          </div>
        </section>

        {/* Daily Tasks */}
        <section className="rounded-[40px] bg-emerald-50/50 p-6 md:p-12 dark:bg-zinc-900/50 dark:border dark:border-zinc-800">
          <div className="mx-auto max-w-lg">
             {currentDayEntry?.isDayCompleted ? (
               <div className="text-center space-y-4 py-10">
                 <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Trophy className="h-10 w-10" />
                 </div>
                 <h2 className="text-3xl font-bold">Day {workingDay} Finished!</h2>
                 <p className="text-zinc-500 italic">"The only way out is through." - See you tomorrow.</p>
               </div>
             ) : (
               <TaskChecklist 
                 dayNumber={workingDay}
                 initialTasks={currentDayEntry?.tasks.map(t => ({
                   id: t.id,
                   label: t.name,
                   icon: t.id === 'water' ? <Droplets className="w-5 h-5 text-blue-500" /> :
                        t.id === 'diet' ? <Utensils className="w-5 h-5 text-emerald-500" /> :
                        t.id === 'workout1' ? <Dumbbell className="w-5 h-5 text-orange-500" /> :
                        t.id === 'workout2' ? <Dumbbell className="w-5 h-5 text-purple-500" /> :
                        t.id === 'reading' ? <BookOpen className="w-5 h-5 text-amber-500" /> :
                        <Camera className="w-5 h-5 text-rose-500" />,
                   completed: t.isCompleted
                 }))}
                 onTaskToggle={(taskId, isCompleted) => updateTask(workingDay, taskId, isCompleted)}
                 onComplete={handleComplete}
               />

             )}
          </div>
        </section>

      </main>

      {/* Mobile Nav Overlay */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-zinc-950/90 p-2 text-white shadow-2xl backdrop-blur-lg dark:bg-emerald-600/90 md:hidden">
        <button className="flex h-12 items-center gap-2 rounded-full bg-white/10 px-6 font-bold">
           <Zap className="h-5 w-5" />
           Tracker
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-full text-zinc-400 hover:text-white">
          <Calendar className="h-6 w-6" />
        </button>
      </nav>
    </div>
  );
}


