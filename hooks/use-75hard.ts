import { create } from "zustand";
import { Task, DayEntry, Challenge } from "@/types";
import { createClient } from "@/utils/supabase/client";

interface TrackerState {
  currentChallenge: Challenge | null;
  lastCompletedDay: number;
  isLoading: boolean;
  hasFetched: boolean; // Tracks if at least one cloud sync has completed
  startChallenge: (startDate: string, userId: string) => Promise<void>;
  updateTask: (dayNumber: number, taskId: string, isCompleted: boolean) => Promise<void>;
  completeDay: (dayNumber: number) => Promise<void>;
  resetChallenge: () => Promise<void>;
  getCurrentDay: () => number;
  fetchChallenge: (userId: string) => Promise<void>;
}

const DEFAULT_TASKS = [
  { id: "water", name: "Drink 1 Gallon Water", isCompleted: false, icon: "droplets" },
  { id: "diet", name: "Follow Diet", isCompleted: false, icon: "utensils" },
  { id: "workout1", name: "Outdoor Workout", isCompleted: false, icon: "dumbbell" },
  { id: "workout2", name: "Second Workout", isCompleted: false, icon: "dumbbell" },
  { id: "reading", name: "Read 10 Pages", isCompleted: false, icon: "book-open" },
  { id: "photo", name: "Take Progress Picture", isCompleted: false, icon: "camera" },
];

export const use75Hard = create<TrackerState>((set, get) => ({
  currentChallenge: null,
  lastCompletedDay: 0,
  isLoading: true,
  hasFetched: false,


  getCurrentDay: () => {
    const { currentChallenge } = get();
    if (!currentChallenge) return 1;
    
    // Offset for Nepal Timezone (UTC +5:45)
    const NEPAL_OFFSET = 5.75 * 60 * 60 * 1000;
    
    // Start date at midnight Nepal time
    const startDate = new Date(currentChallenge.startDate);
    const startNepal = new Date(startDate.getTime() + NEPAL_OFFSET);
    startNepal.setUTCHours(0, 0, 0, 0);

    // Current time in Nepal
    const now = new Date();
    const nowNepal = new Date(now.getTime() + NEPAL_OFFSET);

    // Difference in days
    const diff = nowNepal.getTime() - startNepal.getTime();
    const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    
    return Math.min(Math.max(day, 1), 75);
  },

  fetchChallenge: async (userId) => {
    const supabase = createClient();
    if (!supabase) {
      set({ isLoading: false, hasFetched: true });
      return;
    }
    
    set({ isLoading: true });
    
    const { data, error } = await supabase
      .from('challenges')
      .select('data, last_completed_day')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(); 

    if (error) {
       console.error('Supabase Sync Error:', error.message);
       set({ isLoading: false, hasFetched: true });
       return;
    }

    if (data) {
      set({ 
        currentChallenge: data.data,
        lastCompletedDay: data.last_completed_day,
        isLoading: false,
        hasFetched: true
      });
    } else {
      // User is new
      set({ currentChallenge: null, lastCompletedDay: 0, isLoading: false, hasFetched: true });
    }

  },

  startChallenge: async (startDate, userId) => {
    const supabase = createClient();
    const entries: DayEntry[] = Array.from({ length: 75 }, (_, i) => ({
      dayNumber: i + 1,
      date: new Date(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
      tasks: DEFAULT_TASKS.map(t => ({ ...t })),
      waterProgress: 0,
      isDayCompleted: false,
    }));

    const newChallenge: Challenge = {
      id: crypto.randomUUID(),
      userId,
      startDate,
      currentDay: 1,
      status: "IN_PROGRESS",
      entries,
    };

    set({
      lastCompletedDay: 0,
      currentChallenge: newChallenge,
      isLoading: false
    });

    if (supabase) {
      console.log("☁️ Attempting to save new challenge for user:", userId);
      const { error } = await supabase.from('challenges').upsert({
        user_id: userId,
        data: newChallenge,
        last_completed_day: 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      if (error) {
        console.error('❌ Supabase Save Error:', error.message);
      } else {
        console.log("✅ Challenge synchronized successfully.");
      }
    }
  },

  updateTask: async (dayNumber, taskId, isCompleted) => {
    const supabase = createClient();
    const { currentChallenge, lastCompletedDay } = get();
    if (!currentChallenge) return;

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

    const updatedChallenge: Challenge = {
      ...currentChallenge,
      entries: updatedEntries,
    };

    set({ currentChallenge: updatedChallenge });

    if (supabase) {
      const { error } = await supabase.from('challenges').upsert({
        user_id: currentChallenge.userId,
        data: updatedChallenge,
        last_completed_day: lastCompletedDay,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) console.error('❌ Supabase Async Error:', error.message);
    }
  },

  completeDay: async (dayNumber) => {
    const supabase = createClient();
    const { currentChallenge, lastCompletedDay } = get();
    if (!currentChallenge) return;

    if (dayNumber !== lastCompletedDay + 1) return;

    const updatedEntries = currentChallenge.entries.map((entry) => {
      if (entry.dayNumber === dayNumber) {
        return { ...entry, isDayCompleted: true };
      }
      return entry;
    });

    const updatedChallenge: Challenge = {
      ...currentChallenge,
      entries: updatedEntries,
      status: (dayNumber === 75 ? "COMPLETED" : "IN_PROGRESS") as "COMPLETED" | "IN_PROGRESS",
    };

    set({
      lastCompletedDay: dayNumber,
      currentChallenge: updatedChallenge,
    });

    if (supabase) {
      const { error } = await supabase.from('challenges').upsert({
        user_id: currentChallenge.userId,
        data: updatedChallenge,
        last_completed_day: dayNumber,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) console.error('❌ Supabase Completion Error:', error.message);
    }
  },

  resetChallenge: async () => {
    const supabase = createClient();
    const { currentChallenge } = get();
    if (currentChallenge && supabase) {
      const { error } = await supabase.from('challenges').delete().eq('user_id', currentChallenge.userId);
      if (error) console.error('Supabase Reset Error:', error.message);
    }
    set({ currentChallenge: null, lastCompletedDay: 0 });
  },
}));
