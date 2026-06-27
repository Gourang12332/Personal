"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";

interface CountdownProps {
  targetDate: Date;
  onTimerComplete: () => void;
}

export default function Countdown({ targetDate, onTimerComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      
      if (difference <= 0) {
        setTimeLeft((prev) => ({ ...prev, isComplete: true }));
        if (timerRef.current) clearInterval(timerRef.current);
        // Delay callback slightly to allow animations to settle
        setTimeout(() => {
          onTimerComplete();
        }, 1000);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isComplete: false });
    };

    calculateTimeLeft();
    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetDate, onTimerComplete]);

  // Particle styling canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let frameId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    class StarParticle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.speed = Math.random() * 0.05 + 0.01;
      }

      update() {
        this.opacity += this.speed;
        if (this.opacity > 0.8 || this.opacity < 0.1) {
          this.speed = -this.speed;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = "rgba(244, 114, 182, 0.4)";
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particles = Array.from({ length: 60 }, () => new StarParticle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-obsidian flex items-center justify-center font-sans z-50">
      {/* Background Starry Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 romantic-vignette pointer-events-none" />

      {/* Radiant background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10 text-center max-w-3xl px-6 flex flex-col items-center"
      >
        {/* Countdown Header */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 p-3 bg-pink-950/30 border border-pink-500/20 text-rose-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <Calendar className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(244,114,182,0.6)]" />
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-pink-100 text-glow-rose leading-tight mb-4 select-none">
          A Little Universe Is Opening...
        </h1>
        <p className="text-sm md:text-base text-pink-200/50 font-light mb-12 tracking-widest uppercase select-none">
          Counting down to the moment you entered the world ❤️
        </p>

        {/* Countdown Timer Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-2xl w-full">
          {timeBlocks.map((block) => (
            <div
              key={block.label}
              className="glass-panel border border-pink-500/10 rounded-2xl p-6 flex flex-col justify-center items-center shadow-2xl relative min-w-[110px]"
            >
              {/* Top notch detail */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-rose-500/40 rounded-b-full" />
              
              {/* Numeric display with exit-enter animations */}
              <div className="h-16 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={block.value}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl md:text-5xl font-serif font-bold text-pink-200 text-glow-rose tracking-wider"
                  >
                    {formatNumber(block.value)}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Label */}
              <span className="text-xs uppercase tracking-wider text-pink-300/40 font-medium mt-3">
                {block.label}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle details */}
        <div className="mt-12 flex items-center gap-2 text-rose-400 text-xs md:text-sm tracking-widest font-light italic opacity-70">
          <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
          <span>Something magical awaits you on the other side...</span>
          <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
        </div>
      </motion.div>
    </div>
  );
}
