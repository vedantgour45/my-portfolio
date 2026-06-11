"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import skills from "@/data/skills.json";
import { getIcon } from "@/lib/icons";
import { useGestureContext } from "@/context/GestureContext";

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

// Resolved per-theme via CSS variables in globals.css
const ICON_COLOR = "var(--hero-icon)";
const ACCENT = "rgb(var(--accent-rgb))";

/* ═══ Tuning knobs — adjust to taste ═══════════════════════════════
   size/sizeVar      px — every particle gets size = min + rand·var,
                     so the range is [sizeMin, sizeMin + sizeVar]
   opacity/…Var      0–1, same min + rand·var pattern
   durMin/durVar     seconds for one full crossing — LARGER = slower
   countDesktop/…    how many particles spawn per breakpoint
   Icon color per theme lives in globals.css as --hero-icon.        */
const ICONS = {
  countDesktop: 24,
  countMobile: 14,
  sizeMin: 10, // was 8
  sizeVar: 9, //  was 7  → icons now 10–19px (were 8–15px)
  opacityMin: 0.18, // was 0.12
  opacityVar: 0.18, // was 0.16 → now 0.18–0.36 (was 0.12–0.28)
  durMin: 60,
  durVar: 70,
};
const DOTS = {
  countDesktop: 22,
  countMobile: 14,
  sizeMin: 1.5,
  sizeVar: 1.5,
  opacityMin: 0.25,
  opacityVar: 0.25,
  durMin: 28,
  durVar: 36,
};

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
function buildParticles(iconCount, dotCount, seed = 7) {
  const rand = makeRand(seed);
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
    const dur = ICONS.durMin + rand() * ICONS.durVar;
    out.push({
      kind: "icon",
      key: `i${i}`,
      Icon,
      axis: axisPool[p],
      cross: crossPool[p],
      size: ICONS.sizeMin + rand() * ICONS.sizeVar,
      opacity: ICONS.opacityMin + rand() * ICONS.opacityVar,
      dur,
      delay: -rand() * dur,
    });
  }

  for (let i = 0; i < dotCount; i++, p++) {
    const dur = DOTS.durMin + rand() * DOTS.durVar;
    // Neutral dots use --muted so they stay visible in light mode too
    const tint = rand() < 0.7 ? ACCENT : "var(--muted)";
    out.push({
      kind: "dot",
      key: `d${i}`,
      color: tint,
      axis: axisPool[p],
      cross: crossPool[p],
      size: DOTS.sizeMin + rand() * DOTS.sizeVar,
      opacity: DOTS.opacityMin + rand() * DOTS.opacityVar,
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
  const { shuffleTrigger, cursorPos } = useGestureContext();
  // ✊→🖐 gesture burst — ripple from the hand cursor + re-deal particles
  const [burst, setBurst] = useState(null);

  // Pointer parallax — the whole particle field drifts gently away from
  // the cursor, springs keep it organic.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.6 });
  const py = useSpring(my, { stiffness: 40, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (shuffleTrigger > 0) {
      setBurst({ id: shuffleTrigger, x: cursorPos.x, y: cursorPos.y });
    }
    // cursorPos intentionally read at trigger time only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleTrigger]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * -28);
      my.set((e.clientY / window.innerHeight - 0.5) * -20);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, mx, my]);

  // Re-seeding on shuffleTrigger deals every particle a fresh trajectory
  const particles = useMemo(() => {
    const isSmall =
      typeof window !== "undefined" && window.innerWidth < 768;
    const iconCount = isSmall ? ICONS.countMobile : ICONS.countDesktop;
    const dotCount = isSmall ? DOTS.countMobile : DOTS.countDesktop;
    return buildParticles(iconCount, dotCount, 7 + shuffleTrigger * 31);
  }, [shuffleTrigger]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Deep-space backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--accent-rgb)/0.05),transparent_55%)]" />

      {!reduced && (
        <motion.div
          style={{ x: px, y: py }}
          className="absolute inset-0 scale-105"
        >
          <motion.div
            key={shuffleTrigger}
            initial={shuffleTrigger > 0 ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {particles.map((p) => (
              <Particle key={p.key} p={p} />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Gesture-burst shockwave ring */}
      <AnimatePresence>
        {burst && (
          <motion.div
            key={burst.id}
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${burst.x * 100}%`,
              top: `${burst.y * 100}%`,
              border: "2px solid rgb(var(--accent-rgb) / 0.5)",
              boxShadow: "inset 0 0 60px rgb(var(--accent-rgb) / 0.2)",
            }}
            initial={{ width: 0, height: 0, opacity: 0.9, x: "-50%", y: "-50%" }}
            animate={{
              width: "120vmax",
              height: "120vmax",
              opacity: 0,
              x: "-50%",
              y: "-50%",
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => setBurst(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
