"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Volume2, VolumeX, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface FinalMessageProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export default function FinalMessage({
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
}: FinalMessageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger continuous fireworks/confetti on final section arrival
  const triggerEndingCelebration = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti burst from random locations
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    // Spawn floating background hearts
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    class EndingHeart {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      decay: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 12 + 6;
        this.speedY = -(Math.random() * 1.0 + 0.3);
        this.opacity = Math.random() * 0.4 + 0.2;
        this.decay = Math.random() * 0.002 + 0.001;
      }

      update() {
        this.y += this.speedY;
        this.opacity -= this.decay;
        if (this.opacity < 0) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.speedY = -(Math.random() * 1.0 + 0.3);
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.globalAlpha = this.opacity;
        c.fillStyle = "rgba(244, 114, 182, 0.4)";
        c.beginPath();
        c.moveTo(0, 0);
        c.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, -this.size / 4, 0, this.size);
        c.bezierCurveTo(this.size, -this.size / 4, this.size / 2, -this.size / 2, 0, 0);
        c.fill();
        c.restore();
      }
    }

    const hearts = Array.from({ length: 15 }, () => new EndingHeart());
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      hearts.forEach((h) => {
        h.update();
        h.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#110617] to-[#050207] flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
      {/* Background Hearts Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radiant Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-2xl text-center">
        
        {/* Pulsating Beating Heart */}
        <motion.div
          onClick={triggerEndingCelebration}
          className="cursor-pointer select-none mb-10 flex justify-center items-center relative group"
        >
          {/* Beating Heart Icon */}
          <div className="animate-heartbeat relative flex items-center justify-center">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-600/70 filter drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]" />
          </div>
          
          {/* Pulsing Outer Rings */}
          <div className="absolute inset-0 w-32 h-32 rounded-full border border-pink-500/10 scale-120 animate-ping opacity-25" />
          
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-pink-300/30 uppercase tracking-widest font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to Celebrate ❤️
          </span>
        </motion.div>

        {/* Closing Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-pink-100 mb-6 text-glow-rose leading-tight">
            Forever Grateful That <br />
            I Found You 
          </h2>
          <p className="text-lg md:text-xl text-pink-200/80 font-serif italic font-light tracking-wide max-w-md mx-auto">
            "You are the best and never change this nature for anyone"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-10"
        />

        {/* Romantic Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mb-12 font-handwritten text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-200"
        >
          Happy Birthday, Shejal ❤️
        </motion.div>

        {/* Integrated Music Controls Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border border-pink-500/10 shadow-2xl w-full max-w-md"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 transition-colors text-white cursor-pointer shadow-lg border border-rose-400/20"
            >
              {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="text-left">
              <span className="text-xs text-pink-300/40 uppercase tracking-widest block font-light">
                Ambient Music
              </span>
              <span className="text-sm text-pink-100 font-medium">
                {isPlaying ? "Playing Romantic Soundtrack" : "Soundtrack Paused"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto md:flex-grow">
            <VolumeX className="w-4 h-4 text-pink-300/40" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-pink-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <Volume2 className="w-4 h-4 text-pink-300/40" />
          </div>

          {/* Replay surprise button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-3 rounded-full bg-pink-950/40 hover:bg-pink-950/70 border border-pink-500/20 text-pink-100 cursor-pointer transition-colors"
            title="Scroll to Top"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
