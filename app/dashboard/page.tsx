"use client";

import { motion } from "framer-motion";
import { Flame, Target, Calendar, Trophy, Zap, Share2, Droplets, Utensils, Dumbbell, BookOpen, Camera, Weight, TrendingUp, Clock } from "lucide-react";
import { use75Hard } from "@/hooks/use-75hard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import DayDotGrid from "@/components/dashboard/DayDotGrid";
import TaskChecklist from "@/components/dashboard/TaskChecklist";
import WeightTracker from "@/components/dashboard/WeightTracker";
import WeightHistory from "@/components/dashboard/WeightHistory";
import WeightChart from "@/components/dashboard/WeightChart";
import StatsCard, { DetailedProgress } from "@/components/dashboard/StatsCard";
import { UserButton, useUser, Show, useAuth } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function DashboardPage() {
  const { currentChallenge, lastCompletedDay, getCurrentDay, completeDay, updateTask, updateWeight, resetChallenge, fetchChallenge, isLoading, hasFetched } = use75Hard();
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress'>('overview');

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      fetchChallenge(user.id);
    }
  }, [user?.id, fetchChallenge]);

  const currentDay = getCurrentDay();
  // currentDay=0 means start date hasn't arrived yet
  const challengeStarted = currentDay > 0;
  const workingDay = challengeStarted ? (Math.min(lastCompletedDay + 1, currentDay) || currentDay) : 0;

  useEffect(() => {
    if (hasFetched && workingDay && selectedDay === null) {
      setSelectedDay(workingDay);
    }
  }, [hasFetched, workingDay, selectedDay]);

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

  const activeDay = selectedDay || workingDay;
  const currentDayEntry = currentChallenge?.entries.find(e => e.dayNumber === activeDay);
  const startWeight = currentChallenge?.entries.find(e => e.weight !== undefined)?.weight;
  const latestWeight = currentDayEntry?.weight;
  const weightDelta = (startWeight && latestWeight) ? (latestWeight - startWeight).toFixed(1) : "0.0";
  const completedDays = currentChallenge?.entries.filter(e => e.isDayCompleted).map(e => e.dayNumber) || [];
  const isDayCompleted = currentDayEntry?.isDayCompleted || false;

  return (
    <div className="min-h-screen bg-[#ECECEC] pb-20 dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-[#ECECEC]/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-emerald-500">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">75 Hard <span className="text-emerald-500 italic">Tracker</span></h1>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="flex h-9 items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800 hidden sm:flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "h-7 px-4 rounded-full text-[9px] cursor-pointer font-black uppercase tracking-widest transition-all",
                  activeTab === 'overview' ? "bg-emerald-500 text-zinc-950 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={cn(
                  "h-7 px-4 rounded-full text-[9px] cursor-pointer font-black uppercase tracking-widest transition-all",
                  activeTab === 'progress' ? "bg-emerald-500 text-zinc-950 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                Progress
              </button>
            </div>
            <ThemeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-12 pb-24">
        {/* 🏆 Full-Width Overall Progress */}
        <section className="w-full">
          <DetailedProgress totalDays={75} completedDays={lastCompletedDay} />
        </section>

        {/* 🏗️ Main Dashboard Grid */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Left Side: Long-term & Daily Work */}
            <div className="lg:col-span-2 space-y-8">

              {/* 📍 Row level 1: 75 Day Roadmap */}
              <div className="rounded-[40px] bg-white p-8 border border-zinc-200 shadow-shallow-inner dark:bg-zinc-900 dark:border-zinc-800">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 italic">75 Day <span className="text-emerald-500">Roadmap</span></h2>
                  <p className="text-sm text-zinc-500 font-medium">Unlocked based on device time & date.</p>
                </div>
                <DayDotGrid
                  currentDay={currentDay}
                  completedDays={completedDays}
                  entries={currentChallenge?.entries || []}
                  onDayClick={(day) => { if (day > 0) setSelectedDay(day); }}
                />
              </div>

              {/* 📍 Row level 2: Daily Tasks Section */}
              <section className="rounded-[40px] bg-emerald-50/50 p-6 md:p-12 dark:bg-zinc-900/50 dark:border dark:border-zinc-800 border border-zinc-200 shadow-shallow-inner transition-shadow">
                <div className="mx-auto max-w-xl">
                  {!challengeStarted ? (
                    /* Challenge hasn't started yet — show countdown */
                    <div className="rounded-[40px] bg-zinc-50 p-8 dark:bg-zinc-950/20 shadow-shallow-inner text-center py-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                        <Clock className="h-10 w-10 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 mb-2">NOT STARTED YET</h2>
                      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 italic max-w-xs mx-auto">
                        Your challenge begins on{" "}
                        <span className="text-amber-600 dark:text-amber-400 not-italic">
                          {new Date(currentChallenge.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        . All days are locked until then.
                      </p>
                      {(() => {
                        const startDate = new Date(currentChallenge.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / 86400000);
                        return (
                          <div className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{daysUntilStart}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{daysUntilStart === 1 ? 'day' : 'days'} to go</span>
                          </div>
                        );
                      })()}
                    </div>
                  ) : isDayCompleted ? (
                    <div className="rounded-[40px] bg-zinc-50 p-8 dark:bg-zinc-950/20 shadow-shallow-inner text-center py-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
                      <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                        <Trophy className="h-10 w-10 text-white" />
                      </div>
                      <h2 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 mb-2">DAY {activeDay} FINISHED!</h2>
                      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 italic max-w-xs mx-auto">
                        {[
                          "\"The only way out is through.\"",
                          "\"Discipline is built in the moments you want to quit.\"",
                          "\"You are becoming the person you promised you'd be.\"",
                          "\"Pain is temporary. Pride is forever.\"",
                          "\"One day at a time, one win at a time.\""
                        ][activeDay % 5]} - See you tomorrow.
                      </p>
                    </div>
                  ) : (
                    <TaskChecklist
                      dayNumber={activeDay}
                      initialTasks={(currentDayEntry?.tasks || [])
                        .filter(t => t.id !== 'photo')
                        .map(t => ({
                          id: t.id,
                          label: t.name,
                          icon: t.id === 'water' ? <Droplets className="w-5 h-5 text-blue-500" /> :
                            t.id === 'diet' ? <Utensils className="w-5 h-5 text-emerald-500" /> :
                              t.id === 'workout1' ? <Dumbbell className="w-5 h-5 text-orange-500" /> :
                                t.id === 'workout2' ? <Dumbbell className="w-5 h-5 text-purple-500" /> :
                                  <BookOpen className="w-5 h-5 text-amber-500" />,
                          completed: t.isCompleted
                        }))}
                      onTaskToggle={async (taskId, isCompleted) => {
                        const token = await getToken({ template: "supabase" });
                        updateTask(activeDay, taskId, isCompleted, token || undefined);
                      }}
                      onComplete={async () => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        confetti({
                          particleCount: 150,
                          spread: 70,
                          origin: { y: 0.6 },
                          colors: ["#10b981", "#34d399", "#059669"],
                        });
                        const token = await getToken({ template: "supabase" });
                        completeDay(activeDay, token || undefined);
                      }}
                    />
                  )}
                </div>
              </section>
            </div>

            {/* Right Side: Metrics & Tools (Sidebar) */}
            <div className="space-y-6">

              {/* 📍 Row level 1: Weight Log (Aligned with Roadmap) */}
              <WeightTracker
                currentWeight={latestWeight}
                onUpdate={async (weight) => {
                  const token = await getToken({ template: "supabase" });
                  updateWeight(activeDay, weight, token || undefined);
                }}
              />

              {/* 📍 Row level 2: Stats (Aligned with Tasks) */}
              <div className="grid grid-cols-1 gap-4">
                <StatsCard
                  label="Current Streak"
                  value={`${lastCompletedDay} Days`}
                  icon={<Flame className="h-6 w-6 text-orange-500" />}
                  trend="+1 Today"
                  variant="streak"
                />
                <StatsCard
                  label="Consistency"
                  value={`${Math.round((lastCompletedDay / currentDay) * 100) || 0}%`}
                  icon={<Target className="h-6 w-6 text-emerald-500" />}
                />
                <StatsCard
                  label="Days Left"
                  value={75 - lastCompletedDay}
                  icon={<Calendar className="h-6 w-6 text-indigo-500" />}
                />

              </div>


              {/* Restart Footer */}
              <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="rounded-full bg-white border border-zinc-200 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 dark:bg-zinc-900/50 dark:border-zinc-800 hover:border-red-100 dark:hover:bg-red-950/30 cursor-pointer"
                >
                  Restart Challenge
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <WeightChart entries={currentChallenge?.entries || []} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <WeightHistory entries={currentChallenge?.entries || []} />
              </div>
              <div className="md:col-span-2 space-y-6">
                <WeightTracker
                  currentWeight={latestWeight}
                  onUpdate={async (weight) => {
                    const token = await getToken({ template: "supabase" });
                    updateWeight(activeDay, weight, token || undefined);
                  }}
                />

                {/* 🛡️ Weight Velocity Stats Card - Smart Detection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Daily Burn", days: 1 },
                    { label: "Weekly Momentum", days: 7 },
                    { label: "Monthly Change", days: 30 }
                  ].map((metric) => {
                    const sortedEntries = [...(currentChallenge?.entries || [])]
                      .filter(e => e.weight !== undefined && e.weight !== null)
                      .sort((a, b) => b.dayNumber - a.dayNumber);

                    const latestEntry = sortedEntries[0];
                    const prevEntry = sortedEntries.find(e => e.dayNumber <= (latestEntry?.dayNumber - metric.days));

                    const currentW = latestEntry?.weight;
                    const prevW = prevEntry?.weight;
                    const diff = (currentW && prevW) ? (currentW - prevW).toFixed(2) : null;
                    const isLoss = diff && parseFloat(diff) < 0;
                    const isGain = diff && parseFloat(diff) > 0;

                    return (
                      <div key={metric.label} className="rounded-3xl bg-white p-6 shadow-shallow-inner dark:bg-zinc-950/40 dark:border dark:border-zinc-800/50 flex flex-col justify-between h-32">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{metric.label}</p>
                        <div className="mt-2 flex flex-col">
                          {diff !== null ? (
                            <>
                              <span className={cn(
                                "text-2xl font-black italic tracking-tighter",
                                isLoss ? "text-emerald-500" : isGain ? "text-rose-500" : "text-zinc-400"
                              )}>
                                {isGain ? "+" : ""}{diff}
                                <span className="text-xs font-bold uppercase ml-1">kg</span>
                              </span>
                              <span className="text-[9px] font-bold text-zinc-500 uppercase mt-1">
                                {isLoss ? "🛡️ Solid Burn" : isGain ? "⚖️ Water Check" : "🏹 Maintain"}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-zinc-400 italic">Tracking...</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          resetChallenge();
          router.push("/onboarding");
        }}
        title="Restart Challenge?"
        message="This will permanently delete all your progress data for this 75-day challenge. This action cannot be undone."
      />

      {/* Mobile Nav Overlay */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-zinc-950/90 p-2 text-white shadow-2xl backdrop-blur-lg dark:bg-emerald-600/90 md:hidden z-50">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            "flex h-12 items-center gap-2 rounded-full px-6 font-bold transition-all",
            activeTab === 'overview' ? "bg-white/10 text-white" : "text-zinc-400"
          )}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all",
            activeTab === 'progress' ? "bg-white/10 text-white" : "text-zinc-400"
          )}
        >
          <TrendingUp className="h-6 w-6" />
        </button>
      </nav>
    </div>
  );
}
