"use client";

import { SignInButton, Show } from "@clerk/nextjs";
import { ArrowRight, Zap, Target, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-white font-sans overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-30 select-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-12 max-w-2xl px-4"
        >
          {/* Logo/Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm">
             <Zap className="h-4 w-4 text-emerald-500 fill-current" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Phase 1 Active</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
              75 HARD <br /> 
              <span className="text-emerald-500 not-italic">TRACKER</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-500 max-w-lg mx-auto">
              Build mental toughness with the world's most disciplined cloud-synced platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="h-16 px-10 rounded-full bg-zinc-950 text-white text-xl font-bold flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl dark:bg-emerald-500">
                  GO LIVE NOW
                  <ArrowRight className="h-6 w-6" />
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="h-16 px-10 rounded-full bg-zinc-950 text-white text-xl font-bold flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl dark:bg-emerald-500"
              >
                ACCESS DASHBOARD
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Show>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-zinc-100 dark:border-zinc-900">
             <Feature icon={<Target className="h-4 w-4" />} label="Zero Cheat" />
             <Feature icon={<Shield className="h-4 w-4" />} label="Cloud Safe" />
             <Feature icon={<CheckCircle className="h-4 w-4" />} label="Multi User" />
             <Feature icon={<Zap className="h-4 w-4" />} label="Real Time" />
          </div>
        </motion.div>

        <footer className="absolute bottom-10 flex flex-col items-center gap-2">
           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">Survival of the disciplined</p>
        </footer>
      </main>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
       <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center dark:bg-zinc-900 text-zinc-400">
          {icon}
       </div>
       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
  );
}
