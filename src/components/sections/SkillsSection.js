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
  const cardRef = useRef(null);
  const { gestureActive, cursorPos } = useGestureContext();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const activeZ = useSpring(z, { stiffness: 100, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Sync with Gesture Cursor if active
  useEffect(() => {
    if (!gestureActive || !cardRef.current) return;

    const updateFromGesture = () => {
      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const screenX = cursorPos.x * window.innerWidth;
      const screenY = cursorPos.y * window.innerHeight;

      const dx = screenX - cardCenterX;
      const dy = screenY - cardCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Max interaction distance
      const maxDist = 300;
      if (distance < maxDist) {
        const factor = 1 - distance / maxDist;
        x.set((dx / rect.width) * 0.5);
        y.set((dy / rect.height) * 0.5);
        z.set(factor * 25); // Lift up significantly
      } else {
        x.set(0);
        y.set(0);
        z.set(0);
      }
    };

    updateFromGesture();
  }, [cursorPos, gestureActive, x, y, z]);

  const handleMouseMove = (e) => {
    if (gestureActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
    z.set(20);
  };

  const handleMouseLeave = () => {
    if (gestureActive) return;
    x.set(0);
    y.set(0);
    z.set(0);
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        z: activeZ,
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
      className="relative group rounded-xl md:rounded-2xl h-24 md:h-32 w-[calc(33.33%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-20px)] xl:w-[calc(16.666%-20px)] flex-shrink-0"
    >
      <div
        className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/10 via-transparent to-indigo-500/5 backdrop-blur-xl border border-white/10 group-hover:border-orange-500/30 transition-colors duration-500"
        style={{ transform: "translateZ(0px)" }}
      />

      {/* Holographic Tracking Glow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])}, rgba(249, 115, 22, 0.2), transparent)`,
          transform: "translateZ(10px)",
        }}
      />

      <div
        className="relative h-full w-full flex flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-4 text-center"
        style={{ transform: "translateZ(45px)" }}
      >
        {Icon && (
          <div className="relative">
            <Icon className="w-6 h-6 md:w-10 md:h-10 text-orange-500 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
            <div className="absolute inset-0 blur-xl bg-orange-500/20 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <span className="text-gray-300 font-black tracking-[0.1em] md:tracking-[0.2em] text-[8px] md:text-[10px] uppercase group-hover:text-white transition-colors line-clamp-1">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const [active, setActive] = useState(0);
  const { gestureActive, headRotation } = useGestureContext();

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent pointer-events-none" />

      {/* Cinematic Background Light - Parallaxing with head */}
      <motion.div
        animate={{
          x: headRotation.yaw * 5,
          y: headRotation.pitch * 5,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full opacity-50 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
            SKILLS
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            SKILL<span className="text-gradient">.</span>SET
          </h2>
          {gestureActive && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 px-6 py-2 glass rounded-full border-orange-500/30">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
                  Holographic Control Active
                </span>
              </div>
              <p className="text-[9px] text-gray-500 font-medium tracking-[0.3em] uppercase mt-2 opacity-60">
                Move your hand to interact with the elements
              </p>
            </div>
          )}
        </div>

        {/* Category Tabs - Compact Wrapped Chips for Mobile */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 px-2">
          {skillCategories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-full text-[9px] md:text-xs tracking-widest font-black transition-all duration-500 border border-white/5 relative group overflow-hidden ${
                active === i
                  ? "text-white shadow-[0_8px_20px_rgba(249,115,22,0.15)] bg-orange-500 border-orange-500/50"
                  : "glass text-gray-400 hover:text-white hover:border-orange-500/20"
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
