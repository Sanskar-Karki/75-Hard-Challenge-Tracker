"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star, Flame, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LeaderboardEntry {
  user_id: string;
  last_completed_day: number;
  user_name: string;
  user_image: string;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  currentUserId?: string;
}

export default function Leaderboard({ data, currentUserId }: LeaderboardProps) {
  const top3 = data.slice(0, 3);
  const others = data.slice(3);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* 🏆 podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10">
        {/* Silver - Rank 2 */}
        {top3[1] && (
          <PodiumCard 
            entry={top3[1]} 
            rank={2} 
            isCurrentUser={top3[1].user_id === currentUserId}
            className="md:order-1"
          />
        )}
        
        {/* Gold - Rank 1 */}
        {top3[0] && (
          <PodiumCard 
            entry={top3[0]} 
            rank={1} 
            isCurrentUser={top3[0].user_id === currentUserId}
            className="md:order-2 md:-translate-y-6"
          />
        )}
        
        {/* Bronze - Rank 3 */}
        {top3[2] && (
          <PodiumCard 
            entry={top3[2]} 
            rank={3} 
            isCurrentUser={top3[2].user_id === currentUserId}
            className="md:order-3"
          />
        )}
      </div>

      {/* 📜 List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Rest of the Pack</h3>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Progress</span>
        </div>
        
        <div className="space-y-3">
          {others.map((entry, index) => (
            <LeaderboardRow 
              key={entry.user_id} 
              entry={entry} 
              rank={index + 4} 
              isCurrentUser={entry.user_id === currentUserId}
            />
          ))}
          
          {data.length === 0 && (
            <div className="text-center py-20 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
               <p className="text-zinc-400 italic font-medium">No warriors in the arena yet...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ entry, rank, isCurrentUser, className }: { entry: LeaderboardEntry, rank: number, isCurrentUser: boolean, className?: string }) {
  const colors = {
    1: { bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600", icon: <Crown className="h-6 w-6 text-amber-500 fill-current" />, ring: "ring-amber-500/50" },
    2: { bg: "bg-zinc-50 dark:bg-zinc-500/10", border: "border-zinc-400/30", text: "text-zinc-600", icon: <Medal className="h-6 w-6 text-zinc-400 fill-current" />, ring: "ring-zinc-400/50" },
    3: { bg: "bg-orange-50 dark:bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-600", icon: <Trophy className="h-6 w-6 text-orange-500 fill-current" />, ring: "ring-orange-500/50" },
  }[rank as 1|2|3];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank === 1 ? 0 : rank === 2 ? 0.1 : 0.2 }}
      className={cn(
        "relative rounded-[40px] p-8 border-2 transition-all duration-500 text-center",
        colors.bg, colors.border,
        isCurrentUser && "scale-105 shadow-xl ring-4 " + colors.ring,
        className
      )}
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        {colors.icon}
      </div>
      
      <div className="space-y-4">
        <div className="relative mx-auto h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg dark:border-zinc-800">
          {entry.user_image ? (
            <Image src={entry.user_image} alt={entry.user_name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <User className="h-10 w-10 text-zinc-400" />
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase truncate px-2">
            {entry.user_name || "Warrior"}
          </h3>
          <p className={cn("text-[10px] font-black uppercase tracking-widest", colors.text)}>
            {rank === 1 ? "Alpha Leader" : rank === 2 ? "Elite Challenger" : "Titan of Will"}
          </p>
        </div>

        <div className="flex flex-col items-center">
           <span className="text-4xl font-black italic text-zinc-900 dark:text-zinc-50 tracking-tighter">
             {entry.last_completed_day}
           </span>
           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Days Completed</span>
        </div>
        
        {isCurrentUser && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-white text-[8px] font-black uppercase tracking-[0.2em] dark:bg-emerald-500">
            You
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ entry, rank, isCurrentUser }: { entry: LeaderboardEntry, rank: number, isCurrentUser: boolean }) {
  const percent = Math.round((entry.last_completed_day / 75) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-[30px] bg-white p-4 border border-zinc-100 transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800",
        isCurrentUser ? "border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/20" : "hover:border-zinc-200 hover:shadow-shallow-inner"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-sm font-black italic text-zinc-400 dark:bg-zinc-800">
        #{rank}
      </div>
      
      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border-2 border-zinc-50 dark:border-zinc-800">
        {entry.user_image ? (
          <Image src={entry.user_image} alt={entry.user_name} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <User className="h-6 w-6 text-zinc-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate uppercase tracking-tight">
          {entry.user_name || "Warrior"} 
          {isCurrentUser && <span className="ml-2 text-[8px] text-emerald-500 uppercase font-black tracking-widest">(You)</span>}
        </h4>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percent}%` }}
               className="h-full bg-emerald-500 rounded-full"
             />
          </div>
          <span className="text-[10px] font-black text-zinc-400 w-10">{percent}%</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end pr-4">
        <div className="flex items-center gap-1">
          <Flame className="h-3 w-3 text-orange-500" />
          <span className="text-lg font-black italic text-zinc-900 dark:text-zinc-50">{entry.last_completed_day}</span>
        </div>
        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Days</span>
      </div>
    </motion.div>
  );
}
