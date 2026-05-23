export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  icon: string;
}

export interface DayEntry {
  dayNumber: number; // 1..totalDays
  date: string;
  tasks: Task[];
  waterProgress: number; // 0-1 (normalized)
  isDayCompleted: boolean;
  notes?: string;
  weight?: number;
}

export interface Challenge {
  id: string;
  userId: string;
  userName?: string;
  userImage?: string;
  userEmail?: string;
  startDate: string;
  currentDay: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  entries: DayEntry[];
  totalDays: number;
  tasks: Task[]; // Template of tasks (id, name, icon) used to seed each day
  title?: string; // Optional user-defined challenge title
}

export type TaskIconId =
  | 'droplet'
  | 'utensils'
  | 'dumbbell'
  | 'book'
  | 'camera'
  | 'target'
  | 'pencil'
  | 'sparkles'
  | 'clock'
  | 'heart'
  | 'sun'
  | 'moon'
  | 'check';
