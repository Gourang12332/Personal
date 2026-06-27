"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Film, Sparkles } from "lucide-react";

interface VideoItem {
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
}

export default function Videos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVideos(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeVideo = videos.find((v) => v._id === activeVideoId);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex justify-center items-center bg-obsidian">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }
  const getYoutubeId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/
  );

  return match ? match[1] : "";
  };
  return (
    <section className="relative w-full py-24 bg-obsidian overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[300px] h-[300px] rounded-full bg-rose-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-rose-400 font-serif tracking-widest text-sm uppercase">Reels of Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-pink-100 mt-2 text-glow-rose">
              Cinematic Reels
            </h2>
          </motion.div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {videos.map((vid, index) => (
            <motion.div
              key={vid._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative rounded-2xl overflow-hidden glass-panel p-6 flex flex-col justify-between border border-pink-500/10 h-72 shadow-2xl cursor-pointer"
              onClick={() => setActiveVideoId(vid._id)}
            >
              {/* Card visual elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1b0826] to-[#09050b] opacity-90 -z-10" />
              
              <div className="flex justify-between items-start">
                <span className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/20 text-rose-400">
                  <Film className="w-6 h-6" />
                </span>
                <span className="text-xs text-pink-200/40 font-light uppercase tracking-widest">
                  Memory #{index + 1}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-2xl font-serif font-bold text-pink-100 mb-2 group-hover:text-pink-200 transition-colors">
                  {vid.title}
                </h3>
                <p className="text-sm text-pink-200/70 line-clamp-2 leading-relaxed font-light">
                  {vid.description}
                </p>
              </div>

              {/* Play Button Action */}
              <div className="mt-6 flex items-center justify-between border-t border-pink-500/10 pt-4">
                <span className="text-rose-400 group-hover:text-rose-300 font-medium text-sm flex items-center gap-1.5 transition-colors">
                  <Sparkles className="w-4 h-4 animate-pulse" /> Watch Memory
                </span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 border border-rose-400/30"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Lightbox Player */}
      <AnimatePresence>
        {activeVideoId && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoId(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white cursor-pointer z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-pink-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.videoUrl)}`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
              
              {/* Title Overlay on top of player */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-none">
                <h4 className="text-white text-lg md:text-xl font-serif font-bold">
                  {activeVideo.title}
                </h4>
                <p className="text-white/70 text-xs md:text-sm mt-1 font-light">
                  {activeVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
