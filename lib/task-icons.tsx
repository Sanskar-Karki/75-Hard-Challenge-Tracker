import {
  Droplets,
  Utensils,
  Dumbbell,
  BookOpen,
  Camera,
  Target,
  PencilLine,
  Sparkles,
  Clock,
  Heart,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { TaskIconId } from "@/types";

export interface TaskIconMeta {
  id: TaskIconId;
  label: string;
  color: string; // tailwind text color class
  Component: React.ComponentType<{ className?: string }>;
}

export const TASK_ICONS: TaskIconMeta[] = [
  { id: "droplet", label: "Water", color: "text-blue-500", Component: Droplets },
  { id: "utensils", label: "Diet", color: "text-emerald-500", Component: Utensils },
  { id: "dumbbell", label: "Workout", color: "text-orange-500", Component: Dumbbell },
  { id: "book", label: "Reading", color: "text-amber-500", Component: BookOpen },
  { id: "camera", label: "Photo", color: "text-rose-500", Component: Camera },
  { id: "target", label: "Goal", color: "text-purple-500", Component: Target },
  { id: "pencil", label: "Journal", color: "text-cyan-500", Component: PencilLine },
  { id: "sparkles", label: "Habit", color: "text-pink-500", Component: Sparkles },
  { id: "clock", label: "Time", color: "text-indigo-500", Component: Clock },
  { id: "heart", label: "Self-care", color: "text-red-500", Component: Heart },
  { id: "sun", label: "Morning", color: "text-yellow-500", Component: Sun },
  { id: "moon", label: "Evening", color: "text-violet-500", Component: Moon },
  { id: "check", label: "Generic", color: "text-zinc-500", Component: CheckCircle2 },
];

const ICON_MAP = Object.fromEntries(TASK_ICONS.map((i) => [i.id, i])) as Record<TaskIconId, TaskIconMeta>;

export function getTaskIconMeta(iconId: string): TaskIconMeta {
  return ICON_MAP[iconId as TaskIconId] || { id: "check", label: "Generic", color: "text-zinc-500", Component: Circle };
}

export function renderTaskIcon(iconId: string, className = "w-5 h-5") {
  const meta = getTaskIconMeta(iconId);
  const Icon = meta.Component;
  return <Icon className={`${className} ${meta.color}`} />;
}
