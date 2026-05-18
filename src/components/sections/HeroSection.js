"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/canvas/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0" />,
});

export default function HeroSection({ personal }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
    >
      <HeroScene />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/80 font-medium">
            {personal.availability || "Open to work"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="display-tight text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] text-center"
        >
          <span className="whitespace-nowrap">
            {personal.intro || "Hello, I'm"}
          </span>{" "}
          <span className="whitespace-nowrap">
            <span className="text-gradient">
              {personal.name?.split(" ")[0] || "Vedant"}
            </span>
            <span className="text-orange-500">.</span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-4 mb-7 text-[clamp(1.25rem,2.5vw,2rem)]"
        >
          <span style={{ color: "var(--muted)" }}>a </span>
          <span className="cursive text-orange-400">
            {personal.subRole || personal.role}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-sm md:text-base font-light tracking-wide max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {personal.heroBlurb}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href="#projects" className="btn btn-primary group">
            <span>Explore Work</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href={personal.resumePath || "/assets/resume.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Resume
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 z-20"
      >
        <span
          className="text-[9px] uppercase tracking-[0.4em] font-medium"
          style={{ color: "var(--muted)" }}
        >
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-current/0 via-orange-500 to-current/0 animate-pulse" />
      </motion.div>
    </section>
  );
}
