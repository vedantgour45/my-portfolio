"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 hero-bg" />,
});

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-bg"
    >
      <HeroScene />

      <motion.div style={{ y: y1, opacity }} className="z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[10px] uppercase tracking-[0.4em] text-indigo-300 font-bold mb-6"
        >
          Let&apos;s build something together
        </motion.p>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tighter hero-title">
          Hello, I&apos;m <span className="text-orange-500">Vedant</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-x-4 mb-2"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-light text-white/50 tracking-tight">
            I&apos;m a
          </h2>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, type: "spring" }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-cursive text-orange-400 mt-2 md:mt-0"
          >
            Frontend Developer.
          </motion.span>
        </motion.div>

        {/* Open to Work Badge - Relocated Below Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center my-5"
        >
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group cursor-default shadow-lg shadow-emerald-500/5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-emerald-400/90 group-hover:text-emerald-300 transition-colors">
              Open to work
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-sm md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed hero-subtitle text-gray-300"
        >
          Focused on crafting intuitive, interactive, and visually compelling
          web experiences. Let&apos;s bring your ideas to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto px-10 py-4 glass text-[10px] tracking-[0.2em] font-bold rounded-full hover:bg-white/10 transition-colors uppercase border border-white/10 shadow-none hero-btn text-center"
          >
            Explore Work
          </a>
          <a
            href="/assets/resume.pdf"
            target="_blank"
            className="w-full sm:w-auto px-10 py-4 border-2 border-orange-500/30 text-[10px] tracking-[0.2em] font-bold rounded-full hover:bg-orange-500/10 transition-colors uppercase bg-transparent shadow-none hero-btn text-center"
          >
            Resume
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-4 z-20">
        <div className="w-[1px] h-16 bg-gradient-to-b from-orange-500/0 via-orange-500 to-orange-500/0 animate-pulse" />
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500">
          Scroll Down
        </span>
      </div>
    </section>
  );
}
