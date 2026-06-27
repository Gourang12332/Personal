"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface HeroProps {
  onOpen: () => void;
  targetName: string;
}

export default function Hero({ onOpen, targetName }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Classes
    class HeartParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      decay: number;
      angle: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 15 + 8;
        this.speedY = -(Math.random() * 1.5 + 0.5);
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.decay = Math.random() * 0.003 + 0.001;
        this.angle = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1 - 0.5;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.rotationSpeed;
        this.opacity -= this.decay;
        if (this.opacity < 0) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.speedY = -(Math.random() * 1.5 + 0.5);
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate((this.angle * Math.PI) / 180);
        c.globalAlpha = this.opacity;
        c.fillStyle = "rgba(225, 29, 72, 0.7)"; // Pink-red hearts

        // Drawing heart path
        c.beginPath();
        c.moveTo(0, 0);
        // Left curve
        c.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, -this.size / 4, 0, this.size);
        // Right curve
        c.bezierCurveTo(this.size, -this.size / 4, this.size / 2, -this.size / 2, 0, 0);
        c.fill();
        c.restore();
      }
    }

    class LightDust {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = "rgba(254, 240, 138, 0.6)"; // Glowing gold dust
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const hearts: HeartParticle[] = Array.from({ length: 25 }, () => new HeartParticle());
    const dusts: LightDust[] = Array.from({ length: 40 }, () => new LightDust());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient background glow overlay
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.8
      );
      gradient.addColorStop(0, "rgba(24, 12, 36, 0.3)");
      gradient.addColorStop(1, "rgba(9, 5, 11, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      dusts.forEach((d) => {
        d.update();
        d.draw(ctx);
      });

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

  const handleOpenClick = () => {
    setIsTransitioning(true);
    // Let the screen-curtain transition animation play before starting the reveal
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-obsidian flex items-center justify-center font-sans z-50">
      {/* Dynamic Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 romantic-vignette pointer-events-none" />

      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="z-10 text-center max-w-2xl px-6 flex flex-col items-center"
          >
            {/* Pulsing Floating Heart Icon */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-8 p-4 rounded-full bg-pink-950/40 border border-pink-500/25 flex items-center justify-center shadow-lg shadow-rose-950/20"
            >
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500/60 filter drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
            </motion.div>

            {/* Glowing Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="text-4xl md:text-6xl font-serif font-bold text-glow-rose tracking-wider text-pink-100 mb-6"
            >
              Hey {targetName || "Shejal"} ❤️
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="text-lg md:text-xl text-pink-200/80 font-light mb-12 tracking-wide max-w-md italic"
            >
              This could be the small part of that efforts, which i always miss.
            </motion.p>

            {/* Interactive Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              onClick={handleOpenClick}
              className="relative group px-8 py-4 rounded-full font-serif font-semibold text-lg text-white bg-gradient-to-r from-rose-600 to-pink-500 cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all duration-300 border border-rose-400/30 overflow-hidden"
            >
              {/* Inner glowing hover effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
              
              <span className="relative flex items-center gap-2 z-10 text-shadow-sm">
                Open Your Surprise <Heart className="w-5 h-5 fill-current animate-pulse" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Curtain Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute left-0 top-0 w-1/2 h-full bg-pink-950/95 z-50 border-r border-pink-800/20 flex justify-end items-center pr-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.4 }}
                className="w-1 h-32 bg-rose-500 rounded-full"
              />
            </motion.div>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute right-0 top-0 w-1/2 h-full bg-pink-950/95 z-50 border-l border-pink-800/20 flex justify-start items-center pl-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.4 }}
                className="w-1 h-32 bg-rose-500 rounded-full"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
