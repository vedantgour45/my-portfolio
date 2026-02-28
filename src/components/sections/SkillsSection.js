"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "@/lib/data";
import { useGestureContext } from "@/context/GestureContext";

gsap.registerPlugin(ScrollTrigger);

function SkillCard({ name, delay, Icon }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: delay * 0.04,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group h-32 w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(20%-20px)] xl:w-[calc(16.666%-20px)] flex-shrink-0"
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-transparent to-indigo-500/5 backdrop-blur-xl border border-white/10 group-hover:border-orange-500/30 transition-colors duration-500"
        style={{ transform: "translateZ(0px)" }}
      />

      {/* Holographic Glow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])}, rgba(249, 115, 22, 0.15), transparent)`,
          transform: "translateZ(10px)",
        }}
      />

      <div
        className="relative h-full w-full flex flex-col items-center justify-center gap-3 p-4 text-center"
        style={{ transform: "translateZ(40px)" }}
      >
        {Icon && (
          <div className="relative">
            <Icon className="w-10 h-10 text-orange-500 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
            <div className="absolute inset-0 blur-xl bg-orange-500/20 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <span className="text-gray-300 font-black tracking-[0.2em] text-[10px] uppercase group-hover:text-white transition-colors">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const [active, setActive] = useState(0);
  const { gestureActive } = useGestureContext();

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent pointer-events-none" />

      {/* Cinematic Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
            SKILLS
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            SKILL<span className="text-gradient">.</span>SET
          </h2>
          {gestureActive && (
            <div className="mt-6 flex flex-col items-center gap-2 text-indigo-400 group">
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100 transition-opacity">
                3D Perspective Enabled
              </span>
              <p className="text-[9px] text-gray-500 tracking-widest leading-loose max-w-sm">
                Tilt your head or move your hand to engage with the elements
              </p>
              <div className="w-px h-8 bg-gradient-to-b from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 mt-2" />
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-x-5 gap-y-5 mb-14 flex-wrap items-center">
          {skillCategories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-full text-sm tracking-wider font-bold transition-all duration-500 border border-white/5 relative group overflow-hidden ${
                active === i
                  ? "bg-orange-500 text-white shadow-[0_10px_30px_rgba(249,115,22,0.12)]"
                  : "glass text-gray-500 hover:text-white hover:border-orange-500/20"
              }`}
            >
              {active === i && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {cat.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto pt-4"
          >
            {skillCategories[active].skills.map((skill, i) => (
              <SkillCard
                key={skill.name}
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
