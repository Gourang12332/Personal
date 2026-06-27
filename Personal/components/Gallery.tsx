"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface MemoryItem {
  _id: string;
  image: string;
  caption: string;
  date: string;
  category: string;
}

export default function Gallery() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/memories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMemories(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtered items
  const filteredMemories = memories.filter((m) =>
    activeCategory === "All" ? true : m.category === activeCategory
  );

  // List of unique categories
  const categories = ["All", ...Array.from(new Set(memories.map((m) => m.category)))];

  // Lightbox handlers
  const handleClose = () => setLightboxIndex(null);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredMemories.length - 1));
  }, [lightboxIndex, filteredMemories.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredMemories.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, filteredMemories.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex justify-center items-center bg-obsidian">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (memories.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-[#0a050b] to-[#14081c] overflow-hidden">
      <div className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-yellow-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-rose-400 font-serif tracking-widest text-sm uppercase">Our Canvas</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-pink-100 mt-2 text-glow-rose">
              Memories Painted In Time
            </h2>
          </motion.div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-5 py-2 rounded-full text-sm font-medium tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-rose-400/20"
                    : "bg-pink-950/20 text-pink-200/60 border border-pink-500/10 hover:text-pink-100 hover:bg-pink-950/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 [&>div]:break-inside-avoid">
          {filteredMemories.map((memory, index) => (
            <motion.div
              layout
              key={memory._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setLightboxIndex(index)}
              className="relative rounded-2xl overflow-hidden glass-panel group cursor-pointer shadow-xl border border-pink-500/10 mb-6 block"
            >
              {/* Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={memory.image}
                alt={memory.caption}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-rose-400 text-xs font-semibold tracking-wider flex items-center gap-1.5 mb-1.5 uppercase">
                  <Camera className="w-3.5 h-3.5" />
                  {memory.category} • {memory.date}
                </span>
                <p className="text-pink-100 text-sm md:text-base font-serif font-light leading-relaxed truncate">
                  {memory.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center select-none"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white cursor-pointer z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Control */}
            <button
              onClick={handlePrev}
              className="absolute left-6 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white cursor-pointer z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Main Image & Caption */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filteredMemories[lightboxIndex].image}
                alt={filteredMemories[lightboxIndex].caption}
                className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-pink-500/10"
              />

              <div className="mt-6 text-center max-w-xl">
                <span className="text-rose-400 text-xs font-semibold tracking-widest uppercase">
                  {filteredMemories[lightboxIndex].category} • {filteredMemories[lightboxIndex].date}
                </span>
                <p className="text-pink-100 text-lg md:text-xl font-serif font-light leading-relaxed mt-2 italic">
                  "{filteredMemories[lightboxIndex].caption}"
                </p>
              </div>
            </motion.div>

            {/* Right Control */}
            <button
              onClick={handleNext}
              className="absolute right-6 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white cursor-pointer z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Overlay Footer Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-pink-200/50 text-sm tracking-wider font-light">
              {lightboxIndex + 1} / {filteredMemories.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
