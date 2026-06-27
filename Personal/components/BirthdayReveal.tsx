"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";

interface BirthdayRevealProps {
  targetName: string;
  onRevealComplete: () => void;
}

export default function BirthdayReveal({ targetName, onRevealComplete }: BirthdayRevealProps) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [blownOut, setBlownOut] = useState(false);

  const triggerConfetti = () => {
    // Standard quick burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f43f5e", "#fb7185", "#fde047", "#a78bfa"],
    });

    // Secondary side bursts
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ec4899", "#f43f5e", "#fb7185", "#fde047"],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ec4899", "#f43f5e", "#fb7185", "#fde047"],
      });
    }, 400);
  };

  const handleCandleClick = () => {
    if (!candlesLit) return;
    
    setCandlesLit(false);
    
    // Sparkle effect / audio could be triggered here
    setTimeout(() => {
      setBlownOut(true);
      triggerConfetti();
      onRevealComplete(); // Notify parent to unlock scrolling
    }, 600);
  };

  // Trigger initial fireworks-style confetti when component mounts
  useState(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        triggerConfetti();
      }, 500);
    }
  });

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#180822] to-[#0a050b] flex flex-col justify-center items-center px-4 overflow-hidden py-12">
      {/* Background radial glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-yellow-500/5 blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center max-w-4xl text-center">
        
        {/* Sparkly Birthday Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-4"
        >
          <motion.h2
            animate={{
              textShadow: [
                "0 0 15px rgba(244,114,182,0.4)",
                "0 0 30px rgba(244,114,182,0.7)",
                "0 0 15px rgba(244,114,182,0.4)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl md:text-7xl font-serif font-extrabold text-pink-200 tracking-wide leading-tight select-none"
          >
            Happy Birthday, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-yellow-300">
              {targetName || "Shejal"}
            </span>
          </motion.h2>
          
          <div className="absolute -top-6 -right-6 text-pink-400 hidden md:block">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
        </motion.div>

        {/* Subtitle instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-pink-200/70 text-base md:text-lg max-w-md tracking-wider mb-12 select-none italic font-light"
        >
          {candlesLit
            ? "❤️ Click on the candles to blow them out and make a wish... ❤️"
            : "✨ May all your beautiful wishes come true! ✨"}
        </motion.p>

        {/* Interactive Cake Component */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 60 }}
          className="relative cursor-pointer select-none mb-12"
          onClick={handleCandleClick}
        >
          {/* Cake Candles & Flames */}
          <div className="flex gap-4 justify-center absolute top-8 left-0 right-0 z-20">
            {[1, 2, 3].map((index) => (
              <div key={index} className="relative flex flex-col items-center">
                {/* Flame */}
                <AnimatePresence>
                  {candlesLit && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 0.9, 1.1, 1] }}
                      exit={{ scale: 0, opacity: 0, y: -20 }}
                      transition={{
                        scale: { duration: 0.3 },
                        y: { duration: 0.5 },
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 1.5,
                      }}
                      className="absolute -top-8 w-4 h-8 rounded-full bg-gradient-to-t from-yellow-300 via-orange-400 to-red-500 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] origin-bottom"
                    />
                  )}
                </AnimatePresence>

                {/* Candle Stick */}
                <div className="w-2.5 h-10 rounded-t bg-gradient-to-b from-yellow-200 via-pink-400 to-rose-500 shadow-sm border border-yellow-200/20" />
              </div>
            ))}
          </div>

          {/* Sparkles when blown out */}
          <AnimatePresence>
            {!candlesLit && !blownOut && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-10 left-0 right-0 flex justify-center text-yellow-300"
              >
                <Sparkles className="w-12 h-12 animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG Birthday Cake (Beautiful Glassmorphic Art) */}
          <svg
            width="280"
            height="180"
            viewBox="0 0 280 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_10px_30px_rgba(225,29,72,0.15)] filter"
          >
            {/* Cake Layer 2 (Top) */}
            <path
              d="M30 70C30 50 250 50 250 70V100C250 115 30 115 30 100V70Z"
              fill="url(#cakeTopGrad)"
              stroke="rgba(244,114,182,0.3)"
              strokeWidth="1.5"
            />
            {/* Frosting drips */}
            <path
              d="M30 80C40 85 50 75 60 85C70 95 80 80 90 90C100 80 110 85 120 80C130 90 140 75 150 85C160 80 170 85 180 85C190 90 200 75 210 85C220 80 230 85 240 80C245 83 248 81 250 80V70C250 70 30 70 30 70V80Z"
              fill="#f472b6"
              opacity="0.8"
            />

            {/* Cake Layer 1 (Bottom) */}
            <path
              d="M10 110C10 90 270 90 270 110V150C270 165 10 165 10 150V110Z"
              fill="url(#cakeBaseGrad)"
              stroke="rgba(244,114,182,0.2)"
              strokeWidth="1.5"
            />
            {/* Bottom frosting drops */}
            <path
              d="M10 120C20 125 30 115 40 125C50 135 65 120 75 130C85 120 95 125 110 120C120 130 135 115 145 125C155 120 170 125 180 125C190 130 205 115 215 125C225 120 235 125 245 120C255 130 265 115 270 120V110C270 110 10 110 10 110V120Z"
              fill="#db2777"
              opacity="0.6"
            />

            {/* Plate */}
            <ellipse cx="140" cy="160" rx="135" ry="15" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Gradients */}
            <defs>
              <linearGradient id="cakeTopGrad" x1="140" y1="50" x2="140" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fb7185" />
                <stop offset="1" stopColor="#be185d" />
              </linearGradient>
              <linearGradient id="cakeBaseGrad" x1="140" y1="90" x2="140" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f472b6" />
                <stop offset="1" stopColor="#9d174d" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing candles ring reflection */}
          {candlesLit && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-16 rounded-full bg-yellow-400/5 blur-[20px] pointer-events-none" />
          )}
        </motion.div>

        {/* Scroll Indicator (Shows up when blown out) */}
        <AnimatePresence>
          {blownOut && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="flex flex-col items-center gap-2 mt-4 select-none text-glow-rose cursor-pointer"
              onClick={() => {
                document.getElementById("timeline-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-pink-300 font-serif text-lg tracking-widest font-medium uppercase animate-pulse">
                Scroll Down for Memories
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="p-2 rounded-full border border-pink-500/25 bg-pink-950/20"
              >
                <ArrowDown className="w-5 h-5 text-pink-400" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
