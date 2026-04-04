"use client";

import { motion } from "framer-motion";
import { Zap, Target, Shield, Heart, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 dark:bg-black dark:text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] h-[30%] w-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-emerald-500">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter">75HARD</span>
        </div>
        
        <Link 
          href="/dashboard"
          className="group flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
        >
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </nav>

      <main className="relative z-10 px-6 pt-20 pb-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              New Phase: Evolution
            </span>
            
            <h1 className="mt-8 text-6xl font-black leading-[1.1] tracking-tight sm:text-8xl">
              75 DAYS. <br />
              <span className="text-emerald-500 italic">NO EXCUSES.</span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-500 leading-relaxed dark:text-zinc-400">
              The ultimate mental toughness challenge, now with a premium tracking experience. 
              Visualize your progress, maintain your streak, and transform your life.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link 
                href="/dashboard"
                className="w-full flex h-16 items-center justify-center rounded-3xl bg-zinc-950 px-10 text-xl font-bold text-white shadow-2xl shadow-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-emerald-500 dark:shadow-emerald-900/20 sm:w-auto"
              >
                Launch Tracker
              </Link>
              <button className="w-full flex h-16 items-center justify-center rounded-3xl border border-zinc-200 bg-white px-10 text-xl font-bold transition-all hover:bg-zinc-50 dark:bg-transparent dark:border-zinc-800 sm:w-auto">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 grid gap-8 sm:grid-cols-3"
          >
            {[
              { icon: <Target className="h-8 w-8" />, title: "Precision", desc: "Every task, every day. No room for error." },
              { icon: <Shield className="h-8 w-8" />, title: "Security", desc: "Your data is synced and safe across devices." },
              { icon: <Heart className="h-8 w-8" />, title: "Health", desc: "Build habits that last a lifetime." },
            ].map((f, i) => (
              <div key={i} className="group rounded-[40px] border border-zinc-100 bg-white p-10 text-left transition-all hover:shadow-2xl hover:shadow-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-none">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[24px] bg-zinc-50 text-emerald-500 group-hover:bg-zinc-950 group-hover:text-white dark:bg-zinc-800 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold">{f.title}</h3>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-20 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-10 md:flex-row">
           <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-emerald-500">
               <Zap className="h-5 w-5 fill-current" />
             </div>
             <span className="text-xl font-black tracking-tighter">75HARD</span>
           </div>
           <p className="text-sm text-zinc-400">© 2026 Developed with Grit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
