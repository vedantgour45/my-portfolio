"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { getIcon } from "@/lib/icons";

function SkillChip({ name, iconName, index }) {
  const Icon = getIcon(iconName);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.92 }}
      transition={{
        duration: 0.45,
        delay: index * 0.035,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className="glass rounded-2xl w-28 h-28 sm:w-32 sm:h-32 flex flex-col items-center justify-center p-4 gap-3 transition-colors group-hover:border-orange-500/40">
        {Icon && (
          <div className="relative shrink-0">
            <Icon className="w-8 h-8 text-orange-500 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 blur-xl bg-orange-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <span className="text-xs font-medium tracking-tight text-center leading-tight">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ categories = [] }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  if (!categories.length) return null;
  const activeCat = categories[active];

  return (
    <section id="skills" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div style={{ y: headlineY }} className="mb-10 text-center">
          <span className="eyebrow">Toolkit</span>
          <h2 className="display-tight text-4xl md:text-6xl mt-4 max-w-3xl mx-auto">
            The stack I build with{" "}
            <span className="cursive text-orange-400">every day</span>
            <span className="text-orange-500">.</span>
          </h2>
        </motion.div>

        {/* Category tabs — horizontal wrap row, centered, narrow */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => setActive(i)}
              className={`relative px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${
                active === i ? "" : "border border-current/15"
              }`}
              style={{
                color: active === i ? "#fff" : "var(--muted)",
              }}
            >
              {active === i && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 bg-orange-500 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {cat.title}
            </button>
          ))}
        </div>

        {/* Active category name + count */}
        <div className="flex items-baseline justify-center gap-3 mb-5">
          <h3 className="display text-xl md:text-2xl">
            {activeCat.title}
            <span className="text-orange-500">.</span>
          </h3>
          <span
            className="text-[10px] uppercase tracking-[0.25em] font-medium"
            style={{ color: "var(--muted)" }}
          >
            {activeCat.skills.length} item
            {activeCat.skills.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Skill chips grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex flex-wrap content-start justify-center gap-3 max-w-4xl min-h-[300px] mx-auto"
          >
            {activeCat.skills.map((skill, i) => (
              <SkillChip
                key={skill.name}
                name={skill.name}
                iconName={skill.icon}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
