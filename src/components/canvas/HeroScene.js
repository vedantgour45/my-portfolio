"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import skills from "@/data/skills.json";
import { getIcon } from "@/lib/icons";

// Pool of unique icons referenced anywhere in the skills data.
const ICON_POOL = (() => {
  const names = new Set();
  for (const cat of skills) {
    for (const skill of cat.skills) {
      if (skill.icon) names.add(skill.icon);
    }
  }
  return Array.from(names)
    .map((name) => getIcon(name))
    .filter(Boolean);
})();

// Resolved per-theme via the --hero-icon CSS variable in globals.css
const ICON_COLOR = "var(--hero-icon)";
const ACCENT = "#fb923c";

function makeRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Particles travel linearly across the hero. We position each particle once
 * via `left`/`top` and animate `x`/`y` (GPU-accelerated transforms) — much
 * cheaper than animating layout properties.
 */
function buildParticles(iconCount, dotCount) {
  const rand = makeRand(7);
  const total = iconCount + dotCount;

  const crossPool = shuffle(
    Array.from({ length: total }, (_, i) => ((i + 0.5) / total) * 100),
    rand,
  );
  const axisPool = shuffle(
    Array.from({ length: total }, (_, i) => i % 4),
    rand,
  );

  const out = [];
  let p = 0;

  for (let i = 0; i < iconCount; i++, p++) {
    const Icon = ICON_POOL[Math.floor(rand() * ICON_POOL.length)];
    if (!Icon) continue;
    const dur = 60 + rand() * 70;
    out.push({
      kind: "icon",
      key: `i${i}`,
      Icon,
      axis: axisPool[p],
      cross: crossPool[p],
      size: 8 + rand() * 7,
      opacity: 0.12 + rand() * 0.16,
      dur,
      delay: -rand() * dur,
    });
  }

  for (let i = 0; i < dotCount; i++, p++) {
    const dur = 28 + rand() * 36;
    const tint = rand() < 0.7 ? ACCENT : "#ffffff";
    out.push({
      kind: "dot",
      key: `d${i}`,
      color: tint,
      axis: axisPool[p],
      cross: crossPool[p],
      size: 1.5 + rand() * 1.5,
      opacity: 0.25 + rand() * 0.25,
      dur,
      delay: -rand() * dur,
    });
  }

  return out;
}

/** Resolve a particle's static position + animated transform. */
function particleMotion(p) {
  // axis: 0=L→R, 1=R→L, 2=T→B, 3=B→T
  if (p.axis === 0) {
    return {
      style: { left: 0, top: `${p.cross}%` },
      animate: { x: ["-5vw", "105vw"] },
    };
  }
  if (p.axis === 1) {
    return {
      style: { left: 0, top: `${p.cross}%` },
      animate: { x: ["105vw", "-5vw"] },
    };
  }
  if (p.axis === 2) {
    return {
      style: { left: `${p.cross}%`, top: 0 },
      animate: { y: ["-5vh", "105vh"] },
    };
  }
  return {
    style: { left: `${p.cross}%`, top: 0 },
    animate: { y: ["105vh", "-5vh"] },
  };
}

function Particle({ p }) {
  const { style, animate } = particleMotion(p);
  const transition = {
    duration: p.dur,
    repeat: Infinity,
    ease: "linear",
    delay: p.delay,
  };

  if (p.kind === "icon") {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          ...style,
          width: p.size,
          height: p.size,
          opacity: p.opacity,
          color: ICON_COLOR,
          willChange: "transform",
        }}
        animate={animate}
        transition={transition}
      >
        <p.Icon style={{ color: "currentColor", fontSize: p.size }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        ...style,
        width: p.size,
        height: p.size,
        background: p.color,
        opacity: p.opacity,
        willChange: "transform",
      }}
      animate={animate}
      transition={transition}
    />
  );
}

export default function HeroScene() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  const particles = useMemo(() => {
    const isSmall =
      typeof window !== "undefined" && window.innerWidth < 768;
    // Reduced from 40 / 36 → much cheaper to animate
    const iconCount = isSmall ? 14 : 24;
    const dotCount = isSmall ? 14 : 22;
    return buildParticles(iconCount, dotCount);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Deep-space backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.05),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(99,102,241,0.04),transparent_55%)]" />

      {!reduced &&
        particles.map((p) => <Particle key={p.key} p={p} />)}
    </div>
  );
}
