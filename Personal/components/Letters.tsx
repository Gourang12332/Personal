"use client";

import { useEffect, useState } from "react";
import { motion as framerMotion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen, X, Heart } from "lucide-react";

interface MessageItem {
  _id: string;
  title: string;
  content: string;
  order: number;
}

// Typewriter Text Component
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    
    // Slow down typewriter speed slightly for legibility
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="whitespace-pre-line leading-relaxed font-handwritten text-2xl md:text-3xl text-amber-150/90 text-glow-rose tracking-wide">
      {displayedText}
    </p>
  );
}

export default function Letters() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openLetterId, setOpenLetterId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeMessage = messages.find((m) => m._id === openLetterId);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex justify-center items-center bg-obsidian">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-[#14081c] to-[#0a050b] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-rose-950/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <framerMotion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-rose-400 font-serif tracking-widest text-sm uppercase">Letters</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-pink-100 mt-2 text-glow-rose">
              Words From My Heart
            </h2>
          </framerMotion.div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mt-6" />
        </div>

        {/* Envelope Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center max-w-4xl mx-auto">
          {messages.map((msg, index) => {
            const isOpenedBeforeIndex = openLetterId === msg._id;

            return (
              <framerMotion.div
                key={msg._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setOpenLetterId(msg._id)}
                className="relative rounded-2xl glass-panel p-8 flex flex-col items-center justify-center cursor-pointer border border-pink-500/10 h-64 overflow-hidden group shadow-xl transition-all duration-300"
              >
                {/* Envelope background heart reflection */}
                <div className="absolute inset-0 bg-radial-gradient(circle, rgba(225,29,72,0.05) 0%, transparent 70%) pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Envelope Seal Icon */}
                <framerMotion.div
                  animate={isOpenedBeforeIndex ? { scale: [1, 1.1, 1] } : {}}
                  className="mb-4 p-4 rounded-full bg-pink-950/40 border border-pink-500/20 text-rose-400 group-hover:text-rose-300 transition-colors"
                >
                  <Mail className="w-10 h-10 group-hover:hidden" />
                  <MailOpen className="w-10 h-10 hidden group-hover:block" />
                </framerMotion.div>

                {/* Card Title */}
                <h3 className="text-xl font-serif font-bold text-pink-100 mb-2 tracking-wide text-center">
                  {msg.title}
                </h3>
                <span className="text-xs text-pink-300/40 font-light uppercase tracking-widest mt-1">
                  Envelope {index + 1}
                </span>

                {/* Cute physical seal sticker */}
                <div className="absolute bottom-4 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-rose-500/40 fill-rose-500/10 group-hover:fill-rose-500/30 group-hover:text-rose-500 group-hover:scale-120 transition-all duration-300" />
                </div>
              </framerMotion.div>
            );
          })}
        </div>
      </div>

      {/* Slide-Up Cursive Letter Modal */}
      <AnimatePresence>
        {openLetterId && activeMessage && (
          <framerMotion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <framerMotion.div
              initial={{ y: "100%", scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative w-full max-w-2xl bg-[#fdfaf2] text-[#3c2f1f] rounded-2xl p-8 md:p-12 shadow-2xl border-4 border-[#e8dcc4] min-h-[500px] flex flex-col justify-between my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cursive letter lines background texture */}
              <div className="absolute inset-0 bg-linear-gradient(to-bottom, rgba(0,0,0,0.03) 1px, transparent 1px) bg-[size:100%_2rem] rounded-2xl pointer-events-none p-8" />

              {/* Close Letter Button */}
              <button
                onClick={() => setOpenLetterId(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#ebdcb9] border border-[#d2c09c]/40 text-[#5a4835] cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Letter Header */}
              <div className="relative z-10 border-b-2 border-dashed border-[#e6d0aa] pb-4 mb-6">
                <span className="font-serif text-[#8c6b4f] tracking-widest text-xs uppercase block mb-1">
                  Private & Confidential
                </span>
                <h4 className="font-serif text-[#5c432d] text-2xl md:text-3xl font-bold">
                  {activeMessage.title}
                </h4>
              </div>

              {/* Letter Body (Typewriter) */}
              <div className="relative z-10 flex-grow py-4 pl-2">
                <TypewriterText text={activeMessage.content} />
              </div>

              {/* Letter Footer Signature */}
              <div className="relative z-10 border-t border-[#ebdcb9] pt-6 mt-8 flex justify-between items-center">
                <div className="flex items-center gap-1 text-rose-600">
                  <Heart className="w-5 h-5 fill-current animate-pulse" />
                  <span className="font-handwritten text-xl text-[#5c432d]">Forever Yours</span>
                </div>
                <div className="w-16 h-0.5 bg-[#e2cead]" />
              </div>
            </framerMotion.div>
          </framerMotion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
