"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface WishPageProps {
  targetName: string;
  onNext: () => void;
}

export default function WishPage({ targetName, onNext }: WishPageProps) {
  // Fire confetti bursts on wish page mount
  useEffect(() => {
    const end = Date.now() + 2 * 1000;

    // Fire fireworks style confetti
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#ec4899", "#f43f5e", "#fb7185", "#fde047"],
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Floating background sparkles canvas
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

    class GlowParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      hue: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 4 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.opacity = Math.random() * 0.7 + 0.2;
        this.hue = Math.random() * 20 + 340; // Soft pinks
      }

      update() {
        this.y += this.speedY;
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = `hsla(${this.hue}, 90%, 70%, 0.6)`;
        c.shadowColor = `hsla(${this.hue}, 90%, 60%, 1)`;
        c.shadowBlur = 8;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particles = Array.from({ length: 40 }, () => new GlowParticle());

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#15051a] to-[#0a050b] flex items-center justify-center font-sans z-50">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 romantic-vignette pointer-events-none" />

      {/* Glow overlays */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-pink-500/10 blur-[110px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="z-10 text-center max-w-2xl px-6 flex flex-col items-center"
      >
        {/* Sparkle Icons */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8 p-4 rounded-full bg-pink-950/40 border border-pink-500/20 text-yellow-300"
        >
          <Sparkles className="w-12 h-12 filter drop-shadow-[0_0_8px_rgba(254,240,138,0.8)]" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-pink-100 mb-6 text-glow-rose leading-tight">
          The Clock Has <br />
          Struck Twelve! 🎉
        </h1>

        <motion.h2
          animate={{
            textShadow: [
              "0 0 15px rgba(244,114,182,0.4)",
              "0 0 30px rgba(244,114,182,0.7)",
              "0 0 15px rgba(244,114,182,0.4)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-yellow-300 mb-8"
        >
          Happy Birthday, {targetName || "My Princess"} ❤️
        </motion.h2>

        <p className="text-base md:text-lg text-pink-200/80 font-light leading-relaxed mb-12 italic max-w-lg">
          "Today, the universe became infinitely more beautiful because you were born. I have created a little space filled with our memories, love letters, and small details just for you..."
        </p>

        {/* Pulse button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="group relative px-8 py-4 rounded-full font-serif font-semibold text-lg text-white bg-gradient-to-r from-rose-600 to-pink-500 cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all border border-rose-400/30 flex items-center gap-2 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
          <span className="relative flex items-center gap-2 z-10">
            Begin Your Journey <Heart className="w-5 h-5 fill-current animate-pulse text-pink-100" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
