"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";

const PREVIEW_W = 360;
const PREVIEW_H = 225;

/* Cursor-following preview window. All images stay mounted and crossfade,
   so switching rows never flashes a loading state. */
function HoverPreview({ projects, activeIndex }) {
  const mx = useMotionValue(-PREVIEW_W);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 170, damping: 22, mass: 0.4 });
  const y = useSpring(my, { stiffness: 170, damping: 22, mass: 0.4 });
  // Slight tilt from horizontal travel speed — makes the follow feel physical
  const vx = useVelocity(x);
  const rotate = useTransform(vx, [-1200, 1200], [-4, 4], { clamp: true });

  useEffect(() => {
    const onMove = (e) => {
      mx.set(
        Math.min(e.clientX + 32, window.innerWidth - PREVIEW_W - 16),
      );
      my.set(
        Math.max(
          16 + PREVIEW_H / 2,
          Math.min(e.clientY, window.innerHeight - PREVIEW_H / 2 - 16),
        ),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const visible = activeIndex !== null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[90] pointer-events-none hidden lg:block"
      style={{ x, y, rotate }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative -translate-y-1/2 rounded-2xl overflow-hidden border shadow-2xl"
            style={{
              width: PREVIEW_W,
              height: PREVIEW_H,
              borderColor: "var(--line)",
              background: "var(--bg-elev)",
            }}
          >
            {projects.map((p, i) =>
              p.image ? (
                <Image
                  key={p.id}
                  src={p.image}
                  alt=""
                  fill
                  sizes={`${PREVIEW_W}px`}
                  className="object-cover object-top transition-opacity duration-300"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    viewTransitionName:
                      i === activeIndex ? `project-${p.slug}` : undefined,
                  }}
                />
              ) : null,
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ShowcaseRow({ project, index, onHover, onLeave }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.55,
        delay: (index % 6) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="border-t border-current/10 last:border-b"
    >
      <Link
        href={`/project/${project.slug}`}
        prefetch
        aria-label={`View project: ${project.title}`}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
        className="group flex items-center gap-4 md:gap-8 py-6 md:py-8 px-1 transition-colors"
      >
        {/* Index */}
        <span
          className="hidden md:block w-10 shrink-0 text-xs font-medium tabular-nums tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Inline thumbnail — only where there's no hover preview */}
        {project.image && (
          <span className="relative lg:hidden w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-current/10">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="96px"
              className="object-cover object-top"
            />
          </span>
        )}

        {/* Title block */}
        <span className="flex-1 min-w-0">
          <h3 className="display-tight text-2xl md:text-4xl lg:text-5xl leading-tight md:truncate transition-transform duration-300 ease-out-expo group-hover:translate-x-2">
            <span className="transition-colors group-hover:text-accent-strong">
              {project.title}
            </span>
            <span className="text-accent">.</span>
          </h3>
          {project.subtitle && (
            <span
              className="block cursive text-base md:text-xl mt-1 md:truncate transition-colors group-hover:text-accent-strong"
              style={{ color: "var(--muted)" }}
            >
              {project.subtitle}
            </span>
          )}
        </span>

        {/* Meta */}
        <span
          className="hidden md:flex flex-col items-end gap-1 shrink-0 text-[11px] uppercase tracking-[0.2em] font-medium text-right"
          style={{ color: "var(--muted)" }}
        >
          {project.category && <span>{project.category}</span>}
          {project.year && <span className="opacity-70">{project.year}</span>}
        </span>

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="hidden sm:flex w-10 h-10 shrink-0 rounded-full border border-current/15 items-center justify-center text-sm transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-ink-900 group-hover:rotate-[-45deg]"
        >
          →
        </span>
      </Link>
    </motion.li>
  );
}

export default function ProjectShowcase({ projects = [] }) {
  const [hovered, setHovered] = useState(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  return (
    <div className="relative">
      {canHover && (
        <HoverPreview projects={projects} activeIndex={hovered} />
      )}
      <ul onMouseLeave={() => setHovered(null)}>
        {projects.map((project, i) => (
          <ShowcaseRow
            key={project.id}
            project={project}
            index={i}
            onHover={setHovered}
            onLeave={() => setHovered(null)}
          />
        ))}
      </ul>
    </div>
  );
}
