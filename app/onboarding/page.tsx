"use client";

import { motion } from "framer-motion";
import { Zap, Calendar, Target, Trophy, ChevronRight, Plus, X, ChevronLeft, CheckCircle2 } from "lucide-react";
import { use75Hard } from "@/hooks/use-75hard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CalendarPicker from "@/components/ui/CalendarPicker";
import { TASK_ICONS, renderTaskIcon } from "@/lib/task-icons";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

type Step = "date" | "config" | "summary";

const PRESETS: { id: string; label: string; days: number; tasks: Task[] }[] = [
  {
    id: "7starter",
    label: "7-Day Starter",
    days: 7,
    tasks: [
      { id: "morning_plan", name: "Plan the day in 3 minutes", isCompleted: false, icon: "sun" },
      { id: "movement", name: "Move for 20 minutes", isCompleted: false, icon: "dumbbell" },
      { id: "water", name: "Drink 2L water", isCompleted: false, icon: "droplet" },
      { id: "reflection", name: "Log one win before bed", isCompleted: false, icon: "pencil" },
    ],
  },
  {
    id: "14reset",
    label: "14-Day Reset",
    days: 14,
    tasks: [
      { id: "morning_routine", name: "Complete morning routine", isCompleted: false, icon: "sun" },
      { id: "workout", name: "Exercise for 30 minutes", isCompleted: false, icon: "dumbbell" },
      { id: "clean_meal", name: "Eat one clean meal", isCompleted: false, icon: "utensils" },
      { id: "learn", name: "Read or learn for 10 minutes", isCompleted: false, icon: "book" },
      { id: "wind_down", name: "No phone 30 minutes before sleep", isCompleted: false, icon: "moon" },
    ],
  },
  {
    id: "30discipline",
    label: "30-Day Discipline",
    days: 30,
    tasks: [
      { id: "deep_work", name: "Do 60 minutes of focused work", isCompleted: false, icon: "target" },
      { id: "workout", name: "Workout for 45 minutes", isCompleted: false, icon: "dumbbell" },
      { id: "water", name: "Drink 3L water", isCompleted: false, icon: "droplet" },
      { id: "reading", name: "Read 10 pages", isCompleted: false, icon: "book" },
      { id: "journal", name: "Journal progress and blockers", isCompleted: false, icon: "pencil" },
    ],
  },
  {
    id: "75hard",
    label: "75 Hard",
    days: 75,
    tasks: [
      { id: "water", name: "Drink 4L water", isCompleted: false, icon: "droplet" },
      { id: "diet", name: "Follow your diet with no cheat meals", isCompleted: false, icon: "utensils" },
      { id: "workout1", name: "Complete Outdoor workout (45 minutes)", isCompleted: false, icon: "dumbbell" },
      { id: "workout2", name: "Complete Indoor workout (45 minutes)", isCompleted: false, icon: "dumbbell" },
      { id: "reading", name: "Read 10 pages of nonfiction", isCompleted: false, icon: "book" },
      { id: "photo", name: "Take a progress photo", isCompleted: false, icon: "camera" },
    ],
  },
  {
    id: "blank",
    label: "Blank",
    days: 30,
    tasks: [
      { id: "task1", name: "My daily task", isCompleted: false, icon: "check" },
    ],
  },
];

export default function OnboardingPage() {
  const { startChallenge } = use75Hard();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [step, setStep] = useState<Step>("date");
  const [totalDays, setTotalDays] = useState(PRESETS[0].days);
  const [title, setTitle] = useState(PRESETS[0].label);
  const [tasks, setTasks] = useState<Task[]>(PRESETS[0].tasks.map(t => ({ ...t })));
  const router = useRouter();

  const applyPreset = (id: string) => {
    const preset = PRESETS.find(p => p.id === id);
    if (!preset) return;
    setTotalDays(preset.days);
    setTasks(preset.tasks.map(t => ({ ...t })));
    setTitle(preset.id === "blank" ? "" : preset.label);
  };

  const addTask = () => {
    const id = `task_${Date.now()}`;
    setTasks(prev => [...prev, { id, name: "New task", isCompleted: false, icon: "check" }]);
  };
  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const updateTaskName = (id: string, name: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, name } : t)));
  const updateTaskIcon = (id: string, icon: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, icon } : t)));

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const endDate = new Date(selectedDate);
  endDate.setDate(selectedDate.getDate() + Math.max(totalDays - 1, 0));

  const handleStart = async () => {
    if (!user) return;
    const cleanedTasks = tasks
      .map(t => ({ ...t, name: t.name.trim() }))
      .filter(t => t.name.length > 0);
    if (cleanedTasks.length === 0) return;
    const email = user.emailAddresses[0]?.emailAddress;
    await startChallenge(
      selectedDate.toISOString(),
      user.id,
      { totalDays, tasks: cleanedTasks, title: title.trim() || undefined },
      user.fullName || undefined,
      user.imageUrl || undefined,
      email || undefined
    );
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-start px-4 py-6 dark:bg-black overflow-x-hidden font-sans sm:justify-center sm:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[10%] h-[30%] w-[30%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[20%] w-[20%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Compact Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-lg dark:bg-emerald-500">
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-black italic tracking-tight text-zinc-900 dark:text-zinc-50 uppercase leading-none sm:text-xl">
                {step === "date" ? "Initialize Phase" : step === "config" ? "Configure Challenge" : "Mission Preview"}
              </h1>
              <p className="mt-0.5 text-[10px] text-zinc-500 font-medium">
                {step === "date"
                  ? `Hello ${user?.firstName || "Warrior"}, pick your start date.`
                  : step === "config"
                    ? "Choose your preset, duration, and daily tasks."
                    : "Review the mission before it goes live."}
              </p>
            </div>
          </div>

          {step === "date" ? (
            <DateStep
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onNext={() => setStep("config")}
            />
          ) : step === "config" ? (
            <ConfigStep
              title={title}
              setTitle={setTitle}
              totalDays={totalDays}
              setTotalDays={setTotalDays}
              tasks={tasks}
              addTask={addTask}
              removeTask={removeTask}
              updateTaskName={updateTaskName}
              updateTaskIcon={updateTaskIcon}
              applyPreset={applyPreset}
              onBack={() => setStep("date")}
              onNext={() => setStep("summary")}
            />
          ) : (
            <SummaryStep
              title={title.trim() || "My Challenge"}
              selectedDate={selectedDate}
              endDate={endDate}
              totalDays={totalDays}
              tasks={tasks}
              formatDate={formatDate}
              onBack={() => setStep("config")}
              onStart={handleStart}
            />
          )}

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

function DateStep({
  selectedDate,
  setSelectedDate,
  onNext,
}: {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  onNext: () => void;
}) {
  return (
    <div className="bg-zinc-50 border border-zinc-200/50 rounded-[22px] p-3 space-y-4 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-shallow-inner transition-shadow sm:rounded-[24px] sm:p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-zinc-100 w-fit mx-auto dark:bg-zinc-800 dark:border-zinc-700 shadow-sm">
          <Calendar className="h-2.5 w-2.5 text-emerald-500" />
          <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">Start : {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className="bg-white rounded-xl p-1.5 dark:bg-zinc-950/30 sm:p-2">
          <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate} durationDays={1} showEndDate={false} />
        </div>
      </div>

      <button
        onClick={onNext}
        className="group relative flex w-full h-12 items-center justify-center gap-3 rounded-full bg-zinc-950 text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] overflow-hidden dark:bg-emerald-500 cursor-pointer"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity " />
        CONTINUE
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function ConfigStep({
  title,
  setTitle,
  totalDays,
  setTotalDays,
  tasks,
  addTask,
  removeTask,
  updateTaskName,
  updateTaskIcon,
  applyPreset,
  onBack,
  onNext,
}: {
  title: string;
  setTitle: (v: string) => void;
  totalDays: number;
  setTotalDays: (v: number) => void;
  tasks: Task[];
  addTask: () => void;
  removeTask: (id: string) => void;
  updateTaskName: (id: string, name: string) => void;
  updateTaskIcon: (id: string, icon: string) => void;
  applyPreset: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canStart = totalDays >= 1 && tasks.length > 0 && tasks.every(t => t.name.trim().length > 0);
  const progress = ((totalDays - 1) / 364) * 100;

  return (
    <div className="bg-zinc-50 border border-zinc-200/50 rounded-[22px] p-3 space-y-4 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-shallow-inner sm:rounded-[24px] sm:p-4">
      {/* Presets */}
      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Quick Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={cn(
                "px-3 py-2 rounded-full border text-[10px] font-bold transition-colors cursor-pointer",
                totalDays === p.days && title === p.label
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-emerald-300 hover:text-emerald-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="My Challenge"
          className="w-full h-10 rounded-xl bg-white border border-zinc-200 px-3 text-xs font-bold text-zinc-900 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />
      </div>

      {/* Days */}
      <div className="space-y-3 rounded-2xl bg-white p-3 border border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700">
        <div className="flex items-baseline justify-between">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Duration</label>
          <span className="text-sm font-black italic dark:text-white">{totalDays} <span className="text-[9px] text-zinc-400 font-bold">DAYS</span></span>
        </div>
        <input
          type="range"
          min={1}
          max={365}
          value={totalDays}
          onChange={e => setTotalDays(parseInt(e.target.value) || 1)}
          style={{ background: `linear-gradient(to right, #10b981 0%, #10b981 ${progress}%, #e4e4e7 ${progress}%, #e4e4e7 100%)` }}
          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-emerald-500 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/20"
        />
        <input
          type="number"
          min={1}
          max={365}
          value={totalDays}
          onChange={e => setTotalDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
          className="w-full h-9 rounded-lg bg-white border border-zinc-200 px-3 text-xs font-bold text-zinc-900 outline-none focus:border-emerald-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        />
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Daily Tasks</label>
          <button
            onClick={addTask}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1 sm:max-h-64">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-2 rounded-xl bg-white border border-zinc-200 p-2 dark:bg-zinc-800 dark:border-zinc-700"
            >
              <TaskIconPicker
                alignUp={tasks.length - index <= 2}
                value={task.icon}
                onChange={(icon) => updateTaskIcon(task.id, icon)}
              />
              <input
                type="text"
                value={task.name}
                onChange={(e) => updateTaskName(task.id, e.target.value)}
                placeholder="Task name"
                className="min-w-0 flex-1 h-8 bg-transparent text-xs font-bold text-zinc-900 outline-none dark:text-white"
              />
              <button
                onClick={() => removeTask(task.id)}
                disabled={tasks.length <= 1}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Remove task"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1 h-12 px-4 rounded-full bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canStart}
          className={cn(
            "group relative flex flex-1 h-12 items-center justify-center gap-2 rounded-full text-xs font-bold transition-all overflow-hidden cursor-pointer sm:gap-3 sm:text-sm",
            canStart
              ? "bg-zinc-950 text-white hover:scale-[1.01] active:scale-[0.99] dark:bg-emerald-500"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
          )}
        >
          FINALIZE MISSION
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function SummaryStep({
  title,
  selectedDate,
  endDate,
  totalDays,
  tasks,
  formatDate,
  onBack,
  onStart,
}: {
  title: string;
  selectedDate: Date;
  endDate: Date;
  totalDays: number;
  tasks: Task[];
  formatDate: (date: Date) => string;
  onBack: () => void;
  onStart: () => void;
}) {
  const cleanedTasks = tasks.filter(t => t.name.trim().length > 0);

  return (
    <div className="bg-zinc-50 border border-zinc-200/50 rounded-[22px] p-3 space-y-4 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-shallow-inner sm:rounded-[24px] sm:p-4">
      <div className="rounded-2xl bg-white border border-zinc-200 p-4 dark:bg-zinc-800 dark:border-zinc-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Challenge</p>
            <h2 className="mt-1 text-xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {title}
            </h2>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <SummaryMetric label="Start" value={formatDate(selectedDate)} />
          <SummaryMetric label="End" value={formatDate(endDate)} />
          <SummaryMetric label="Duration" value={`${totalDays} days`} />
          <SummaryMetric label="Daily Tasks" value={`${cleanedTasks.length} tasks`} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Daily checklist</p>
        <div className="max-h-[38vh] space-y-2 overflow-y-auto pr-1 sm:max-h-72">
          {cleanedTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-xl bg-white border border-zinc-200 p-3 dark:bg-zinc-800 dark:border-zinc-700"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900">
                {renderTaskIcon(task.icon, "w-4 h-4")}
              </div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{task.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1 h-12 px-4 rounded-full bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onStart}
          className="group relative flex flex-1 h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 text-xs font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] overflow-hidden dark:bg-emerald-500 cursor-pointer sm:gap-3 sm:text-sm"
        >
          START MISSION
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/70">
      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
      <p className="mt-1 text-xs font-black text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

function TaskIconPicker({
  value,
  onChange,
  alignUp = false,
}: {
  value: string;
  onChange: (id: string) => void;
  alignUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-9 w-9 flex items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 hover:border-emerald-300 dark:bg-zinc-900 dark:border-zinc-700 cursor-pointer"
        aria-label="Pick icon"
      >
        {renderTaskIcon(value, "w-4 h-4")}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[998] cursor-pointer" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute z-[999] left-0 w-56 grid grid-cols-6 gap-1 p-2 rounded-xl bg-white border border-zinc-200 shadow-2xl dark:bg-zinc-900 dark:border-zinc-700",
              alignUp ? "bottom-10" : "top-10"
            )}
          >
            {TASK_ICONS.map(icon => (
              <button
                key={icon.id}
                type="button"
                onClick={() => { onChange(icon.id); setOpen(false); }}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer",
                  value === icon.id && "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                )}
                title={icon.label}
              >
                {renderTaskIcon(icon.id, "w-4 h-4")}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
