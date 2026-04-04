export interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
  icon: string;
}

export interface DayEntry {
  dayNumber: number; // 1-75
  date: string;
  tasks: Task[];
  waterProgress: number; // 0-1 (normalized)
  isDayCompleted: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface Challenge {
  id: string;
  userId: string;
  startDate: string;
  currentDay: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  entries: DayEntry[];
}

export type TaskType = 'water' | 'diet' | 'workout1' | 'workout2' | 'reading' | 'photo';
