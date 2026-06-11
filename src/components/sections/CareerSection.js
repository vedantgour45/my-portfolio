"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

/* ── Helpers ─────────────────────────────────────────────── */

function startYear(s) {
  const m = String(s || "").match(/\d{4}/);
  return m ? parseInt(m[0], 10) : 0;
}

function mergeTimeline(experience, education) {
  const exp = experience.map((e) => ({
    id: `exp-${e.id}`,
    kind: "experience",
    title: e.role,
    org: e.company,
    location: e.location,
    start: e.start,
    end: e.end,
    current: !!e.current,
    bullets: e.bullets || [],
    sortKey: startYear(e.start),
  }));
  const edu = education.map((e) => ({
    id: `edu-${e.id}`,
    kind: "education",
    title: e.degree,
    org: e.institution,
    location: e.location,
    start: e.start,
    end: e.end,
    current: false,
    bullets: e.bullets || [],
    sortKey: startYear(e.start),
  }));
  // Newest first
  return [...exp, ...edu].sort((a, b) => b.sortKey - a.sortKey);
}

/* ── Sub-cards ───────────────────────────────────────────── */

function DateBox({ start, end, current }) {
  const [startMonth, startYear] = String(start || "").trim().split(/\s+/);
  const isPresent =
    current || String(end || "").toLowerCase().trim() === "present";
  const [endMonth, endYear] = isPresent
    ? [null, null]
    : String(end || "").trim().split(/\s+/);

  return (
    <div className="glass rounded-xl px-3 py-3 flex flex-col items-center text-center shrink-0 w-[96px]">
      {/* Start */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] font-medium text-accent-strong">
          {startMonth}
        </div>
        <div className="display text-xl md:text-2xl leading-none mt-0.5">
          {startYear}
        </div>
      </div>

      {/* Separator */}
      <div className="my-2 w-6 h-px bg-accent/40" />

      {/* End */}
      <div>
        {isPresent ? (
          <div className="display text-xl md:text-2xl leading-none text-emerald-400">
            Now
          </div>
        ) : (
          <>
            <div className="text-[10px] uppercase tracking-[0.25em] font-medium text-accent-strong">
              {endMonth}
            </div>
            <div className="display text-xl md:text-2xl leading-none mt-0.5">
              {endYear}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MainCard({ entry }) {
  const Icon = entry.kind === "experience" ? Briefcase : GraduationCap;
  return (
    <div className="glass rounded-xl p-4 md:p-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <Icon className="w-3 h-3 text-accent" />
        </div>
        <span
          className="text-[10px] uppercase tracking-[0.3em] font-medium"
          style={{ color: "var(--muted)" }}
        >
          {entry.kind === "experience" ? "Experience" : "Education"}
        </span>
        {entry.current && (
          <span className="ml-auto text-[10px] uppercase tracking-[0.2em] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Current
          </span>
        )}
      </div>

      <h3 className="display-tight text-lg md:text-xl leading-tight">
        {entry.title}
      </h3>
      <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-accent-strong mt-1.5">
        {entry.org}
      </p>
      {entry.location && (
        <p
          className="text-[10px] tracking-wide mt-0.5"
          style={{ color: "var(--muted)" }}
        >
          {entry.location}
        </p>
      )}

      {entry.bullets?.length > 0 && (
        <p
          className="text-sm leading-relaxed font-light mt-3"
          style={{ color: "var(--muted)" }}
        >
          {entry.bullets[0]}
        </p>
      )}
    </div>
  );
}

/* ── Desktop alternating row ─────────────────────────────── */

function DesktopRow({ entry, side, index }) {
  // Left-side row: [main][date]●--- (date sits closer to center)
  // Right-side row: ---●[date][main]
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="grid grid-cols-[1fr_24px_1fr] items-center gap-5 lg:gap-8"
    >
      {/* Left half */}
      <div className="min-w-0">
        {side === "left" && (
          <div className="flex items-stretch gap-3 justify-end">
            <MainCard entry={entry} align="left" />
            <DateBox
              start={entry.start}
              end={entry.end}
              current={entry.current}
            />
          </div>
        )}
      </div>

      {/* Center — dot */}
      <div className="flex items-center justify-center relative">
        <span className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/15" />
      </div>

      {/* Right half */}
      <div className="min-w-0">
        {side === "right" && (
          <div className="flex items-stretch gap-3 justify-start">
            <DateBox
              start={entry.start}
              end={entry.end}
              current={entry.current}
            />
            <MainCard entry={entry} align="right" />
          </div>
        )}
      </div>
    </motion.li>
  );
}

/* ── Mobile single-column row ────────────────────────────── */

function MobileRow({ entry, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative pl-12"
    >
      {/* Dot */}
      <span className="absolute left-[14px] top-5 w-3 h-3 rounded-full bg-accent ring-4 ring-accent/15 -translate-x-1/2" />

      <div className="flex items-stretch gap-3">
        <DateBox
          start={entry.start}
          end={entry.end}
          current={entry.current}
        />
        <MainCard entry={entry} />
      </div>
    </motion.li>
  );
}

/* ── Section ─────────────────────────────────────────────── */

export default function CareerSection({ experience = [], education = [] }) {
  const timeline = useMemo(
    () => mergeTimeline(experience, education),
    [experience, education],
  );

  if (timeline.length === 0) return null;

  return (
    <section id="career" className="section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="eyebrow">Journey</span>
          <h2 className="display-tight text-4xl md:text-6xl mt-4 max-w-3xl mx-auto">
            Where I&apos;ve been and{" "}
            <span className="cursive text-accent-strong">what I learned</span>
            <span className="text-accent">.</span>
          </h2>
        </div>

        {/* ── Desktop: alternating ──────────────────────── */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          {/* Central vertical line — solid, visible, runs through every dot */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent/30 -translate-x-1/2" />
          <ul className="relative space-y-5">
            {timeline.map((entry, i) => (
              <DesktopRow
                key={entry.id}
                entry={entry}
                side={i % 2 === 0 ? "left" : "right"}
                index={i}
              />
            ))}
          </ul>
        </div>

        {/* ── Mobile: single column ─────────────────────── */}
        <div className="md:hidden relative">
          <div className="absolute left-[14px] top-0 bottom-0 w-px bg-accent/30" />
          <ul className="relative space-y-5">
            {timeline.map((entry, i) => (
              <MobileRow key={entry.id} entry={entry} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
