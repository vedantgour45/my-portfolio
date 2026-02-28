"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "@/lib/data";
import { useGestureContext } from "@/context/GestureContext";

gsap.registerPlugin(ScrollTrigger);

function SkillCard({ name, delay, Icon }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay * 0.05,
        duration: 0.4,
        ease: "easeOut",
        layout: { type: "spring", bounce: 0.2, duration: 0.6 },
      }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(249, 115, 22, 0.05)", // orange-500/5
        borderColor: "rgba(249, 115, 22, 0.2)", // orange-500/20
      }}
      className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 text-center cursor-default transition-colors duration-300 group"
    >
      {Icon && (
        <Icon className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
      )}
      <span className="text-gray-300 font-bold tracking-wider group-hover:text-white transition-colors">
        {name}
      </span>
    </motion.div>
  );
}

export default function SkillsSection() {
  const [active, setActive] = useState(0);
  const [currentSkills, setCurrentSkills] = useState(skillCategories[0].skills);
  const { shuffleTrigger, gestureActive } = useGestureContext();

  // Load new skills when category changes
  useEffect(() => {
    setCurrentSkills(skillCategories[active].skills);
  }, [active]);

  // Shuffle when trigger updates
  useEffect(() => {
    if (shuffleTrigger > 0) {
      setCurrentSkills((prev) => [...prev].sort(() => Math.random() - 0.5));
    }
  }, [shuffleTrigger]);

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
            SKILLS
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            SKILL<span className="text-gradient">.</span>SET
          </h2>
          {gestureActive && (
            <div className="mt-4 flex items-center justify-center gap-2 text-orange-500/80 animate-pulse">
              <span className="text-xl">👋</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                Wave fast horizontally to shuffle
              </span>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {skillCategories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-none ${
                active === i
                  ? "bg-orange-500 text-white"
                  : "glass text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {currentSkills.map((skill, i) => (
              <SkillCard
                key={skill.name} // Keeps consistent identity for layout animation
                name={skill.name}
                Icon={skill.icon}
                delay={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
