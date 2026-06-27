"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Heart, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface PasscodePageProps {
  onPasscodeCorrect: () => void;
}

export default function PasscodePage({ onPasscodeCorrect }: PasscodePageProps) {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: inputCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ec4899", "#fb7185", "#fde047", "#a78bfa"],
        });
        
        setTimeout(() => {
          onPasscodeCorrect();
        }, 1500);
      } else {
        setError("Hmm, that's not the secret key. Try again, miss shejal ");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#0a050b] to-[#160620] flex items-center justify-center font-sans z-50 px-6">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-rose-500/5 rounded-full blur-[90px]" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-pink-500/10 relative z-10 shadow-2xl">
        
        {/* Lock status header */}
        <div className="text-center mb-8">
          <motion.div
            animate={isUnlocked ? { scale: [1, 1.2, 1], rotate: 360 } : { scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: isUnlocked ? 0 : Infinity }}
            className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border transition-colors duration-500 ${
              isUnlocked
                ? "bg-green-950/40 border-green-500/30 text-green-400"
                : "bg-pink-950/40 border-pink-500/20 text-rose-400"
            }`}
          >
            {isUnlocked ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-pink-100 mt-4">
            Secret Gate
          </h1>
          <p className="text-xs md:text-sm text-pink-200/50 mt-1 font-light tracking-wide">
            The precious feeling you want to show for me, but can't show right now
          </p>
        </div>

        {/* Unlock Success Display */}
        <AnimatePresence mode="wait">
          {isUnlocked ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 flex flex-col items-center gap-3"
            >
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-ping" />
              <p className="text-green-400 font-serif font-semibold text-lg animate-pulse">Passcode Correct!</p>
              <p className="text-xs text-pink-300/40">Unlocking your surprise universe...</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-pink-300 font-medium mb-2">
                  Secret Passcode
                </label>
                <input
                  type="text"
                  required
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-pink-950/20 border border-pink-500/15 rounded-xl px-4 py-3 text-pink-100 placeholder-pink-300/15 focus:outline-none focus:border-rose-500 transition-colors text-center tracking-widest text-lg font-bold"
                  placeholder="••••"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs bg-red-950/20 border border-red-500/20 rounded-xl py-2.5 px-4 text-center leading-relaxed"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Action Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-serif font-semibold py-3 rounded-xl cursor-pointer shadow-lg shadow-rose-950/30 flex items-center justify-center gap-2"
              >
                {isLoading ? "Validating..." : "Unlock Surprise"} <ArrowRight className="w-4 h-4" />
              </button>

              {/* Persistent Oral Hint */}
              <div className="border-t border-pink-500/10 pt-4 mt-4">
                <div className="glass-panel p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.02]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-400 block mb-1">
                    Clue
                  </span>
                  <p className="text-xs text-pink-200/80 leading-relaxed italic">
                     Hint : "Your YES or NO depends on that."
                  </p>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
