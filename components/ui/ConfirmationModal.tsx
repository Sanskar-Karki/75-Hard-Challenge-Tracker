"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  requirePhrase?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  requirePhrase = "I QUIT 75 HARD CHALLENGE"
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");
  const isPhraseCorrect = inputValue.trim().toUpperCase() === requirePhrase.toUpperCase();

  // Reset input when modal closes
  useEffect(() => {
    if (!isOpen) setInputValue("");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-zinc-950/40 backdrop-blur-sm dark:bg-black/90"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 pointer-events-auto"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-500",
                  isPhraseCorrect
                    ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10"
                    : "bg-red-50 text-red-500 dark:bg-red-500/10"
                )}>
                  {isPhraseCorrect ? (
                    <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-300" />
                  ) : (
                    <AlertCircle className="h-10 w-10" />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-[0.1em] text-zinc-900 dark:text-zinc-50">
                    {title}
                  </h3>
                  <p className="text-[13px] text-zinc-500 font-medium leading-relaxed px-2">
                    {message}
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <p className="text-[12px] pb-2 font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      Type phrase to confirm:
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={requirePhrase}
                        className={cn(
                          "w-full h-12 rounded-2xl border bg-zinc-50 px-4 text-xs font-bold text-zinc-900 shadow-shallow-inner outline-none transition-all dark:bg-zinc-800 dark:text-white text-center",
                          isPhraseCorrect
                            ? "border-emerald-500 ring-4 ring-emerald-500/10"
                            : "border-zinc-500/50 focus:border-red-500 ring-4 ring-red-500/0 focus:ring-red-500/10"
                        )}
                      />
                      {isPhraseCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 pt-2">
                    <motion.button
                      disabled={!isPhraseCorrect}
                      onClick={() => {
                        onConfirm();
                        onClose();
                      }}
                      whileHover={isPhraseCorrect ? { scale: 1.02 } : {}}
                      whileTap={isPhraseCorrect ? { scale: 0.98 } : {}}
                      className={cn(
                        "flex h-14 w-full items-center justify-center rounded-2xl text-sm font-bold transition-all duration-500 shadow-lg cursor-pointer",
                        isPhraseCorrect
                          ? "bg-red-500 text-white shadow-red-500/20"
                          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 grayscale opacity-50 cursor-not-allowed"
                      )}
                    >
                      Restart Challenge
                    </motion.button>
                    <button
                      onClick={onClose}
                      className={cn(
                        "flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-50 text-xs font-bold text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:bg-zinc-950/20 dark:hover:bg-zinc-800 cursor-pointer",
                        isPhraseCorrect
                          ? "bg-emerald-500 text-white shadow-emerald-500/20"
                          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 grayscale opacity-50 cursor-not-allowed"
                      )}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
