"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 hero-bg" />
  ),
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

      <motion.div
        style={{ y: y1, opacity }}
        className="z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold mb-6"
        >
          Let&apos;s build something together
        </motion.p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tighter hero-title">
          Hello, I am <span className="text-gradient">Vedant Gour</span>
        </h1>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter text-white/90">
          I&apos;m a Front End Developer.
        </h2>

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-base md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed hero-subtitle text-gray-300"
        >
          Focused on crafting intuitive, interactive, and visually compelling web experiences. Let&apos;s bring your ideas to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex justify-center gap-6"
        >
          <a
            href="#projects"
            className="px-10 py-4 glass text-[10px] tracking-[0.2em] font-bold rounded-full hover:bg-white/10 transition-colors uppercase border border-white/10 shadow-none hero-btn"
          >
            Explore Work
          </a>
          <a
            href="/assets/resume.pdf"
            target="_blank"
            className="px-10 py-4 border-2 border-indigo-500/30 text-[10px] tracking-[0.2em] font-bold rounded-full hover:bg-indigo-500/10 transition-colors uppercase bg-transparent shadow-none hero-btn"
          >
            Resume
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <div className="w-[1px] h-16 bg-gradient-to-b from-indigo-500/0 via-indigo-500 to-indigo-500/0 animate-pulse" />
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500">
          Scroll Down
        </span>
      </div>
    </section>
  );
}
