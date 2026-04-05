import { create } from "zustand";
import { Task, DayEntry, Challenge } from "@/types";
import { createClient } from "@/utils/supabase/client";

interface TrackerState {
  currentChallenge: Challenge | null;
  lastCompletedDay: number;
  isLoading: boolean;
  hasFetched: boolean; // Tracks if at least one cloud sync has completed
  startChallenge: (startDate: string, userId: string) => Promise<void>;
  updateTask: (dayNumber: number, taskId: string, isCompleted: boolean, token?: string) => Promise<void>;
  updateWeight: (dayNumber: number, weight: number, token?: string) => Promise<void>;
  completeDay: (dayNumber: number, token?: string) => Promise<void>;
  resetChallenge: () => Promise<void>;
  getCurrentDay: () => number;
  fetchChallenge: (userId: string) => Promise<void>;
}

const DEFAULT_TASKS: Task[] = [
  { id: 'water', name: 'Drink 4L Water', isCompleted: false, icon: 'droplet' },
  { id: 'diet', name: 'Stick to Diet', isCompleted: false, icon: 'utensils' },
  { id: 'workout1', name: 'Workout 1 (45min)', isCompleted: false, icon: 'dumbbell' },
  { id: 'workout2', name: 'Workout 2 (45min)', isCompleted: false, icon: 'dumbbell' },
  { id: 'reading', name: 'Read 10 Pages', isCompleted: false, icon: 'book' },
];

export const use75Hard = create<TrackerState>((set, get) => ({
  currentChallenge: null,
  lastCompletedDay: 0,
  isLoading: true,
  hasFetched: false,
  updateWeight: async (dayNumber: number, weight: number, token?: string) => {
    const challenge = get().currentChallenge;
    const supabase = createClient(token);
    if (!challenge || !supabase) return;

    const updatedEntries = challenge.entries.map((entry: DayEntry) =>
      entry.dayNumber === dayNumber ? { ...entry, weight } : entry
    );
    
    const updatedChallenge = { ...challenge, entries: updatedEntries };
    set({ currentChallenge: updatedChallenge });

    // Cloud sync logic (Dual-sync to both tables)
    // 1. Sync to 'days' table (for fast analytics/charts)
    const dayEntry = updatedEntries.find(e => e.dayNumber === dayNumber);
    if (dayEntry) {
      console.log("☁️ Syncing day update to days table...");
      await supabase.from("days").upsert({
        user_id: challenge.userId,
        day_number: dayNumber,
        tasks: dayEntry.tasks,
        water_progress: dayEntry.waterProgress,
        is_day_completed: dayEntry.isDayCompleted,
        weight: weight,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,day_number" });
    }

    // 2. Sync to 'challenges' table (the main JSONB blob)
    console.log("☁️ Syncing overall challenge blob...");
    await supabase.from('challenges').upsert({
      user_id: challenge.userId,
      data: updatedChallenge,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  },


  getCurrentDay: () => {
    const { currentChallenge } = get();
    if (!currentChallenge) return 1;
    
    // Normalize both dates to midnight local time for pure day counting
    const startDate = new Date(currentChallenge.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Difference in days (1000 * 60 * 60 * 24 = 86,400,000 ms per day)
    const diffTime = today.getTime() - startDate.getTime();
    const day = Math.floor(diffTime / 86400000) + 1;
    
    // Return 0 if day is <= 0 (start date hasn't arrived yet)
    // This keeps all days locked until the challenge actually begins
    return Math.min(Math.max(day, 0), 75);
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
      const challengeData = data.data;
      const { data: daysData } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', userId);

      const entriesMap = new Map();
      daysData?.forEach(day => {
        const dayNum = Number(day.day_number);
        entriesMap.set(dayNum, {
          dayNumber: dayNum,
          date: day.date,
          tasks: day.tasks || [],
          waterProgress: day.water_progress || 0,
          isDayCompleted: day.is_day_completed || false,
          weight: day.weight || undefined,
          notes: day.notes || ''
        });
      });

      const mergedEntries = challengeData.entries.map((entry: DayEntry) => ({
        ...entry,
        dayNumber: Number(entry.dayNumber),
        ...(entriesMap.get(Number(entry.dayNumber)) || {})
      }));

      set({ 
        currentChallenge: { ...challengeData, entries: mergedEntries },
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

  updateTask: async (dayNumber, taskId, isCompleted, token?: string) => {
    const supabase = createClient(token);
    const { currentChallenge } = get();
    if (!currentChallenge || !supabase) return;

    // Allow task updates on any day that's unlocked (based on device date)
    // No longer restricted to consecutive days only

    const updatedEntries = currentChallenge.entries.map((entry) => {
      if (entry.dayNumber === dayNumber) {
        const updatedTasks = entry.tasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted } : task
        );
        return { ...entry, tasks: updatedTasks };
      }
      return entry;
    });

    const updatedChallenge = { ...currentChallenge, entries: updatedEntries };
    set({ currentChallenge: updatedChallenge });

    // Sync individual day to 'days' table
    const dayEntry = updatedEntries.find(e => e.dayNumber === dayNumber);
    if (dayEntry) {
      await supabase.from('days').upsert({
        user_id: currentChallenge.userId,
        day_number: dayNumber,
        tasks: dayEntry.tasks,
        water_progress: dayEntry.waterProgress,
        is_day_completed: dayEntry.isDayCompleted,
        weight: dayEntry.weight,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,day_number' });
    }
  },

  completeDay: async (dayNumber, token?: string) => {
    const supabase = createClient(token);
    const { currentChallenge, lastCompletedDay } = get();
    if (!currentChallenge || !supabase) return;

    // Allow completing any unlocked day (no longer restricted to consecutive days)

    const updatedEntries = currentChallenge.entries.map((entry) => {
      if (entry.dayNumber === dayNumber) {
        return { ...entry, isDayCompleted: true };
      }
      return entry;
    });

    const updatedChallenge = {
      ...currentChallenge,
      entries: updatedEntries,
      status: (dayNumber === 75 ? "COMPLETED" : "IN_PROGRESS"),
    };

    set({
      lastCompletedDay: Math.max(lastCompletedDay, dayNumber),
      currentChallenge: updatedChallenge as any,
    });

    // Sync individual day to 'days' table
    const dayEntry = updatedEntries.find(e => e.dayNumber === dayNumber);
    if (dayEntry) {
      await supabase.from('days').upsert({
        user_id: currentChallenge.userId,
        day_number: dayNumber,
        tasks: dayEntry.tasks,
        water_progress: dayEntry.waterProgress,
        is_day_completed: true,
        weight: dayEntry.weight,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,day_number' });
    }

    // Also update overall status in challenges table
    await supabase.from('challenges').update({
      last_completed_day: Math.max(lastCompletedDay, dayNumber),
      updated_at: new Date().toISOString()
    }).eq('user_id', currentChallenge.userId);
  },

  resetChallenge: async () => {
    const supabase = createClient();
    const { currentChallenge } = get();
    if (currentChallenge && supabase) {
      await supabase.from('challenges').delete().eq('user_id', currentChallenge.userId);
      await supabase.from('days').delete().eq('user_id', currentChallenge.userId);
    }
    set({ currentChallenge: null, lastCompletedDay: 0 });
  },
}));
