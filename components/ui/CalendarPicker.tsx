"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  durationDays?: number;
  showEndDate?: boolean;
}

export default function CalendarPicker({ selectedDate, onChange, durationDays = 75, showEndDate = true }: CalendarPickerProps) {
  const offsetDays = Math.max(1, durationDays) - 1;
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];

    // Fill leading empty days
    const firstDay = date.getDay();
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isTargetDate = (date: Date) => {
    const target = new Date(selectedDate);
    target.setDate(target.getDate() + offsetDays);
    return date.toDateString() === target.toDateString();
  };

  return (
    <div className="w-full select-none cursor-default">
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-700 active:scale-95 shadow-sm cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <h3 className="text-xs font-black uppercase italic tracking-[0.18em] text-zinc-900 dark:text-zinc-50 sm:text-sm sm:tracking-[0.3em]">
          {viewDate.toLocaleString("default", { month: "long" })} <span className="text-zinc-400 font-medium not-italic">{viewDate.getFullYear()}</span>
        </h3>

        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-700 active:scale-95 shadow-sm cursor-pointer"
        >
          <ChevronRight className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <span key={i} className="text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {daysInMonth.map((date, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {date ? (
              <button
                onClick={() => onChange(date)}
                className={cn(
                  "w-9 h-9 text-[10px] font-extrabold rounded-lg transition-all flex items-center justify-center cursor-pointer sm:h-8 sm:w-8",
                  isSelected(date)
                    ? "bg-zinc-950 text-white scale-110 shadow-lg dark:bg-emerald-500 ring-2 ring-emerald-500/20"
                    : showEndDate && isTargetDate(date)
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                      : isToday(date)
                        ? "bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-950 dark:bg-emerald-500" />
            <span className="text-zinc-400">Start Date</span>
          </div>
          <span className="text-zinc-900 dark:text-zinc-50 font-bold">
            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {showEndDate && (
          <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/30 ring-1 ring-emerald-500/50" />
              <span className="text-zinc-400">End Date</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {new Date(new Date(selectedDate).getTime() + offsetDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
