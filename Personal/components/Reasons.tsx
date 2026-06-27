"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface ReasonItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

function ReasonCard({ reason, index }: { reason: ReasonItem; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Dynamic Lucide Icon Mapper
  const IconComponent = (Icons as any)[reason.icon] || Icons.Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsFlipped(!isFlipped)}
      className="group perspective-1000 w-full h-80 cursor-pointer select-none"
    >
      <div
        className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Card Front Side */}
        <div className="absolute inset-0 w-full h-full rounded-2xl glass-panel p-6 flex flex-col items-center justify-center border border-pink-500/10 backface-hidden shadow-2xl">
          {/* Glowing Icon Container */}
          <div className="p-5 rounded-full bg-pink-950/40 border border-pink-500/20 text-rose-400 group-hover:text-rose-300 transition-colors mb-6 shadow-inner">
            <IconComponent className="w-10 h-10 filter drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif font-bold text-pink-100 text-center tracking-wide">
            {reason.title}
          </h3>

          <span className="text-xs text-pink-300/30 uppercase tracking-widest font-light mt-4">
            Click to Flip ❤️
          </span>
        </div>

        {/* Card Back Side */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-pink-950/90 to-rose-900/90 p-8 flex flex-col items-center justify-center border border-pink-500/20 backface-hidden rotate-y-180 shadow-2xl text-center">
          {/* Cute Tiny Heart */}
          <Icons.Heart className="w-6 h-6 text-rose-400 fill-rose-500/30 mb-4 animate-pulse" />

          {/* Description */}
          <p className="text-pink-100 text-sm md:text-base leading-relaxed font-light font-serif italic max-h-[160px] overflow-y-auto">
            "{reason.description}"
          </p>

          <span className="text-xs text-pink-200/40 uppercase tracking-widest font-light mt-6">
            Click to Return
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Reasons() {
  const [reasons, setReasons] = useState<ReasonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reasons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReasons(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex justify-center items-center bg-obsidian">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (reasons.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-[#0a050b] to-[#110617] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-950/15 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-rose-400 font-serif tracking-widest text-sm uppercase">Why You</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-pink-100 mt-2 text-glow-rose">
              Reasons I Like You
            </h2>
          </motion.div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <ReasonCard key={reason._id} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
