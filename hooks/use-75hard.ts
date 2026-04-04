import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, DayEntry, Challenge } from "@/types";

interface TrackerState {
  currentChallenge: Challenge | null;
  lastCompletedDay: number;
  startChallenge: (startDate: string) => void;
  updateTask: (dayNumber: number, taskId: string, isCompleted: boolean) => void;
  completeDay: (dayNumber: number) => void;
  resetChallenge: () => void;
  getCurrentDay: () => number;
}

const DEFAULT_TASKS = [
  { id: "water", name: "Drink 1 Gallon Water", isCompleted: false, icon: "droplets" },
  { id: "diet", name: "Follow Diet", isCompleted: false, icon: "utensils" },
  { id: "workout1", name: "Outdoor Workout", isCompleted: false, icon: "dumbbell" },
  { id: "workout2", name: "Second Workout", isCompleted: false, icon: "dumbbell" },
  { id: "reading", name: "Read 10 Pages", isCompleted: false, icon: "book-open" },
  { id: "photo", name: "Take Progress Picture", isCompleted: false, icon: "camera" },
];

export const use75Hard = create<TrackerState>()(
  persist(
    (set, get) => ({
      currentChallenge: null,
      lastCompletedDay: 0,

      getCurrentDay: () => {
        const { currentChallenge } = get();
        if (!currentChallenge) return 1;
        
        const start = new Date(currentChallenge.startDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        
        return Math.min(Math.max(day, 1), 75);
      },

      startChallenge: (startDate) => {
        const entries: DayEntry[] = Array.from({ length: 75 }, (_, i) => ({
          dayNumber: i + 1,
          date: new Date(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
          tasks: DEFAULT_TASKS.map(t => ({ ...t })),
          waterProgress: 0,
          isDayCompleted: false,
        }));

        set({
          lastCompletedDay: 0,
          currentChallenge: {
            id: crypto.randomUUID(),
            userId: "user", // Clerk will handle this later
            startDate,
            currentDay: 1, // Will be computed dynamically in the UI
            status: "IN_PROGRESS",
            entries,
          },
        });
      },

      updateTask: (dayNumber, taskId, isCompleted) => {
        const { currentChallenge, lastCompletedDay } = get();
        if (!currentChallenge) return;

        // Prevent updating tasks of skipped days
        if (dayNumber > lastCompletedDay + 1) return;

        const updatedEntries = currentChallenge.entries.map((entry) => {
          if (entry.dayNumber === dayNumber) {
            const updatedTasks = entry.tasks.map((task) =>
              task.id === taskId ? { ...task, isCompleted } : task
            );
            return { ...entry, tasks: updatedTasks };
          }
          return entry;
        });

        set({
          currentChallenge: {
            ...currentChallenge,
            entries: updatedEntries,
          },
        });
      },

      completeDay: (dayNumber) => {
        const { currentChallenge, lastCompletedDay } = get();
        if (!currentChallenge) return;

        // Ensure sequential completion
        if (dayNumber !== lastCompletedDay + 1) return;

        const updatedEntries = currentChallenge.entries.map((entry) => {
          if (entry.dayNumber === dayNumber) {
            return { ...entry, isDayCompleted: true };
          }
          return entry;
        });

        set({
          lastCompletedDay: dayNumber,
          currentChallenge: {
            ...currentChallenge,
            entries: updatedEntries,
            status: dayNumber === 75 ? "COMPLETED" : "IN_PROGRESS",
          },
        });
      },

      resetChallenge: () => set({ currentChallenge: null, lastCompletedDay: 0 }),
    }),
    {
      name: "75hard-storage",
    }
  )
);

