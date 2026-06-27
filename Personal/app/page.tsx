"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Countdown from "@/components/Countdown";
import PasscodePage from "@/components/PasscodePage";
import Hero from "@/components/Hero";
import BirthdayReveal from "@/components/BirthdayReveal";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import Letters from "@/components/Letters";
import Videos from "@/components/Videos";
import Reasons from "@/components/Reasons";
import FinalMessage from "@/components/FinalMessage";

type FlowStep = "loading" | "countdown" | "passcode" | "hero" | "reveal" | "story";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("loading");
  const [name, setName] = useState("Shejal");
  const [targetDate, setTargetDate] = useState<Date>(new Date(2026, 5, 27, 0, 0, 0)); // Default June 27, 2026

  // Audio Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize configurations and state
  useEffect(() => {
    const initFlow = async () => {
      // 1. Read query parameters
      let nameParam = "Shejal";
      let dateOverride = "";
      let bypassParam = false;

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        nameParam = params.get("name") || "Shejal";
        dateOverride = params.get("date") || "";
        bypassParam = params.get("bypass") === "true";
        setName(nameParam);
      }

      // 2. Fetch server-side configs
      let serverBirthdayStr = "";
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const config = await res.json();
          serverBirthdayStr = config.birthdayDate || "";
        }
      } catch (e) {
        console.error("Failed to load configs from API", e);
      }

      // 3. Determine target date
      let calculatedTarget = new Date(2026, 5, 27, 0, 0, 0); // fallback default June 27, 2026

      if (dateOverride === "test") {
        // Test mode: Count down from 10 seconds from now
        calculatedTarget = new Date(Date.now() + 10 * 1000);
      } else if (dateOverride === "past") {
        // Skip countdown: target date is in the past
        calculatedTarget = new Date(Date.now() - 60 * 1000);
      } else if (dateOverride) {
        // Custom URL date override
        calculatedTarget = new Date(dateOverride);
      } else if (serverBirthdayStr) {
        // Server configured date
        calculatedTarget = new Date(serverBirthdayStr);
      }

      setTargetDate(calculatedTarget);

      // 4. Set current step
      if (bypassParam) {
        setCurrentStep("hero");
      } else if (calculatedTarget.getTime() > Date.now()) {
        setCurrentStep("countdown");
      } else {
        setCurrentStep("passcode");
      }
    };

    initFlow();
  }, []);

  // Update audio volume ref
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimerComplete = () => {
    setCurrentStep("passcode");
  };

  const handlePasscodeCorrect = () => {
    setCurrentStep("hero");
  };

  const handleOpenSurprise = () => {
    setCurrentStep("reveal");

    // Play background music (safely unlocked by user gesture)
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play blocked", e));
    }
  };

  const handleRevealComplete = () => {
    setCurrentStep("story");
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play blocked", e));
    }
  };

  return (
    <div className="relative w-full bg-obsidian text-pink-100 min-h-screen select-none font-sans">
      
      {/* Background Audio tag */}
      <audio
        ref={audioRef}
        src="/music/bg.mp3"
        loop
        preload="auto"
      />

      <AnimatePresence mode="wait">
        {/* Loading State */}
        {currentStep === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian z-50 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </motion.div>
        )}

        {/* Phase 1: Countdown Timer */}
        {currentStep === "countdown" && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 w-full h-full"
          >
            <Countdown targetDate={targetDate} onTimerComplete={handleTimerComplete} />
          </motion.div>
        )}

        {/* Phase 2: Passcode Page */}
        {currentStep === "passcode" && (
          <motion.div
            key="passcode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 w-full h-full"
          >
            <PasscodePage onPasscodeCorrect={handlePasscodeCorrect} />
          </motion.div>
        )}

        {/* Phase 3: Magical Landing Screen */}
        {currentStep === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 w-full h-full"
          >
            <Hero onOpen={handleOpenSurprise} targetName={name} />
          </motion.div>
        )}

        {/* Phase 4: Cake Reveal Screen */}
        {currentStep === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 w-full h-full overflow-hidden"
          >
            <BirthdayReveal targetName={name} onRevealComplete={handleRevealComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 5: The Complete Story (Unlocked by Blowing Cake Candles) */}
      {currentStep === "story" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full"
        >
          {/* Main Cinematic Sections Scroll */}
          <main className="w-full">
            <BirthdayReveal targetName={name} onRevealComplete={() => {}} />
            <Timeline />
            <Gallery />
            <Letters />
            <Videos />
            <Reasons />
            <FinalMessage
              isPlaying={isPlaying}
              onTogglePlay={toggleMusic}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </main>

          {/* Sticky Floating Audio Toggle Widget (bottom-right) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: "spring" }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={toggleMusic}
              className="p-3.5 rounded-full glass-panel border border-pink-500/20 text-rose-400 hover:text-rose-300 transition-all shadow-2xl cursor-pointer flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]"
              title={isPlaying ? "Mute Music" : "Play Music"}
            >
              {isPlaying ? (
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Volume2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <VolumeX className="w-5 h-5 opacity-60" />
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
