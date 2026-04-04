"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps 
} from "recharts";
import { DayEntry } from "@/types";
import { cn } from "@/lib/utils";

// 🛡️ Custom Modern Tooltip with Glassmorphism
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-2xl ring-1 ring-black/5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Day {label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black italic tracking-tighter text-indigo-600 dark:text-indigo-400">
            {payload[0].value}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase">kg</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function WeightChart({ entries, className }: { entries: DayEntry[], className?: string }) {
  // Filter and sort the data for the chart
  const chartData = entries
    .filter(e => e.weight !== undefined && e.weight !== null)
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map(e => ({
      day: e.dayNumber,
      weight: e.weight
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center rounded-[40px] bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest italic text-center">
          No weight data logged yet.<br/>Log your weight to see your transformation.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("h-[400px] w-full rounded-[40px] bg-white p-8 shadow-shallow-inner dark:bg-zinc-900/30 dark:border dark:border-zinc-800 transition-all duration-700", className)}>
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
          Weight <span className="text-indigo-500">Flux</span>
        </h2>
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">75-DAY TRANSFORMATION MAP</p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="currentColor" 
              className="text-zinc-100 dark:text-zinc-800/50" 
            />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 900 }}
              dy={10}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 900 }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#6366f1" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#weightGradient)" 
              animationDuration={1500}
              activeDot={{ 
                r: 6, 
                stroke: '#6366f1', 
                strokeWidth: 2, 
                fill: 'white'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
