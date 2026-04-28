"use client";

import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useRef } from "react";
import LabCanvas from "@/components/LabCanvas";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smoothed scroll progress for text animations to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Beat A: 0-20%
  const beatAOpacity = useTransform(smoothProgress, [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
  const beatAY = useTransform(smoothProgress, [0, 0.05, 0.15, 0.2], [20, 0, 0, -20]);

  // Beat B: 25-45%
  const beatBOpacity = useTransform(smoothProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  const beatBY = useTransform(smoothProgress, [0.25, 0.3, 0.4, 0.45], [20, 0, 0, -20]);

  // Beat C: 50-70%
  const beatCOpacity = useTransform(smoothProgress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
  const beatCY = useTransform(smoothProgress, [0.5, 0.55, 0.65, 0.7], [20, 0, 0, -20]);

  // Beat D: 75-100%
  const beatDOpacity = useTransform(smoothProgress, [0.75, 0.8, 0.9, 1], [0, 1, 1, 1]);
  const beatDY = useTransform(smoothProgress, [0.75, 0.8, 0.9, 1], [20, 0, 0, 0]);

  // Initial indicator fade out
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <main className="relative bg-[#050505]">
      {/* 800vh container for scroll duration */}
      <div ref={containerRef} className="h-[800vh] w-full relative">
        <LabCanvas scrollYProgress={smoothProgress} />

        {/* Text Overlays - Fixed over the sticky canvas */}
        <div className="fixed inset-0 pointer-events-none flex flex-col justify-center items-center z-10 px-6 text-center">
          
          {/* Scroll to Explore Indicator */}
          <motion.div 
            style={{ opacity: indicatorOpacity }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
          >
            <span className="text-white/50 text-sm tracking-widest uppercase">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>

          {/* Beat A */}
          <motion.div 
            style={{ opacity: beatAOpacity, y: beatAY }}
            className="absolute max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ff87]">
              ADVANCED NEURAL INTERFACE
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light">
              Bridging human cognition with AI computing via BCI Systems.
            </p>
          </motion.div>

          {/* Beat B */}
          <motion.div 
            style={{ opacity: beatBOpacity, y: beatBY }}
            className="absolute max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ff87]">
              ROBOTIC SURGERY SIMULATION
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light">
              Precision-driven pre-op planning with real-time holographic rendering.
            </p>
          </motion.div>

          {/* Beat C */}
          <motion.div 
            style={{ opacity: beatCOpacity, y: beatCY }}
            className="absolute max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ff87]">
              AI BRAIN DIAGNOSTICS
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light">
              Deep learning pattern analysis for instant neurological mapping.
            </p>
          </motion.div>

          {/* Beat D */}
          <motion.div 
            style={{ opacity: beatDOpacity, y: beatDY }}
            className="absolute max-w-3xl pointer-events-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#00ff87]">
              INTELLIGENT MEDICAL SYSTEMS
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-light mb-8">
              Welcome to the future of healthcare technology.
            </p>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-[#00ff87]/50 transition-all duration-300 backdrop-blur-sm group">
              <span className="group-hover:text-[#00ff87] transition-colors">Explore Projects</span>
            </button>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
