"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Heart } from "lucide-react";

interface TimelineItem {
  _id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  order: number;
}

export default function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timeline")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
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

  if (items.length === 0) {
    return null; // Don't render empty section (handled by seed utility later)
  }

  return (
    <section id="timeline-section" className="relative w-full py-24 bg-obsidian overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] rounded-full bg-rose-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-rose-400 font-serif tracking-widest text-sm uppercase">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-pink-100 mt-2 text-glow-rose">
              How We Became "Us"
            </h2>
          </motion.div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Timeline Line */}
        <div className="relative">
          {/* Central Vertical Line (hidden on tiny mobile, shifted on small mobile) */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-rose-500 via-pink-400 to-rose-600 opacity-30 shadow-[0_0_8px_rgba(244,114,182,0.3)]" />

          {/* Timeline Cards */}
          <div className="space-y-16 md:space-y-24">
            {items.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item._id}
                  className={`flex flex-col md:flex-row items-stretch w-full relative ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node (Heart Bullet) */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="w-8 h-8 rounded-full bg-pink-950 border-2 border-rose-500 flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.5)] cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30" />
                    </motion.div>
                  </div>

                  {/* Empty space for alternate column (desktop only) */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card Content Side */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12 flex justify-start">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-150px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden w-full flex flex-col shadow-2xl border border-pink-500/10"
                    >
                      {/* Milestone Image */}
                      {item.image && (
                        <div className="relative w-full h-48 md:h-64 overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#100818]/80 via-transparent to-transparent opacity-60" />
                        </div>
                      )}

                      {/* Details */}
                      <div className="p-6 md:p-8 flex flex-col flex-grow">
                        {/* Date Tag */}
                        <div className="flex items-center gap-2 text-rose-300 font-medium text-sm mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{item.date}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-pink-100 mb-3 group-hover:text-pink-200">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm md:text-base text-pink-200/70 font-light leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
