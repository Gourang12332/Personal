"use client";

import { useEffect, useRef } from "react";

export default function SparkleCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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

    // Particle class
    class CursorParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      decay: number;
      color: string;
      isHeart: boolean;
      angle: number;
      spin: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5 - 0.5; // slight upward drift
        this.opacity = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
        this.isHeart = Math.random() > 0.6;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 2;

        // alternate colors between rose gold, blush pink, and warm gold
        const rand = Math.random();
        if (rand < 0.4) {
          this.color = "rgba(244, 114, 182, "; // pink
        } else if (rand < 0.7) {
          this.color = "rgba(254, 240, 138, "; // gold
        } else {
          this.color = "rgba(225, 29, 72, "; // red-rose
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        this.opacity -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate((this.angle * Math.PI) / 180);
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color + this.opacity + ")";
        c.shadowColor = this.color + "0.8)";
        c.shadowBlur = this.size / 2;

        if (this.isHeart) {
          // Draw heart
          c.beginPath();
          c.moveTo(0, 0);
          c.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, -this.size / 4, 0, this.size);
          c.bezierCurveTo(this.size, -this.size / 4, this.size / 2, -this.size / 2, 0, 0);
          c.fill();
        } else {
          // Draw four-pointed sparkle star
          c.beginPath();
          c.moveTo(0, -this.size);
          c.quadraticCurveTo(0, 0, this.size, 0);
          c.quadraticCurveTo(0, 0, 0, this.size);
          c.quadraticCurveTo(0, 0, -this.size, 0);
          c.quadraticCurveTo(0, 0, 0, -this.size);
          c.fill();
        }
        c.restore();
      }
    }

    const particles: CursorParticle[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      // Spawn 1-2 particles per mouse movement
      particles.push(new CursorParticle(e.clientX, e.clientY));
      if (Math.random() > 0.5) {
        particles.push(new CursorParticle(e.clientX, e.clientY));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        particles.push(new CursorParticle(e.touches[0].clientX, e.touches[0].clientY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.opacity <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 mix-blend-screen"
    />
  );
}
