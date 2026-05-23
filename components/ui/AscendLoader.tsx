"use client";

import { Zap } from "lucide-react";

interface AscendLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export default function AscendLoader({ label = "Preparing Ascend", fullScreen = false }: AscendLoaderProps) {
  return (
    <div className={fullScreen ? "flex min-h-screen items-center justify-center bg-[#ECECEC] px-6 dark:bg-black" : "flex items-center justify-center py-20"}>
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl border border-emerald-400/30 bg-white/70 shadow-shallow-inner dark:bg-zinc-900/80" />
          <div className="absolute inset-2 animate-ping rounded-2xl bg-emerald-400/15" />
          <div className="absolute inset-0 animate-spin rounded-3xl border-2 border-transparent border-t-emerald-500 border-r-emerald-300" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl dark:bg-emerald-500 dark:text-zinc-950">
            <Zap className="h-6 w-6 fill-current" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xl font-black italic tracking-tight text-zinc-900 dark:text-zinc-50">Ascend</p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{label}</p>
        </div>

        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full w-1/2 animate-[ascend-loader_1.15s_ease-in-out_infinite] rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}
