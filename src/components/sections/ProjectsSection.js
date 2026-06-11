"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Rows, LayoutGrid } from "lucide-react";
import ProjectShowcase from "@/components/sections/ProjectShowcase";

function ProjectCard({ project, index, featured = false }) {
  const cardRef = useRef(null);

  // Cursor-tracking spotlight — feeds --mx/--my to .card-spotlight
  const onMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      className={`group ${featured ? "sm:col-span-2" : ""}`}
    >
      <Link
        href={`/project/${project.slug}`}
        prefetch
        className="block h-full"
        aria-label={`View project: ${project.title}`}
      >
        <article
          ref={cardRef}
          onMouseMove={onMouseMove}
          className="relative h-full glass rounded-2xl transition-all duration-300 group-hover:border-accent/40 overflow-hidden"
        >
          {/* Cursor spotlight */}
          <div className="card-spotlight absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative flex flex-col h-full">
            {/* Screenshot */}
            {project.image && (
              <div
                className={`relative overflow-hidden ${
                  featured ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes={
                    featured
                      ? "(max-width: 640px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  style={{ viewTransitionName: `project-${project.slug}` }}
                />
                <div
                  className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500"
                  aria-hidden="true"
                />
              </div>
            )}

            <div className="flex flex-col flex-1 p-5">
              {/* Top meta */}
              <div className="flex items-center justify-between mb-4">
                {project.category ? (
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] font-medium px-2 py-1 rounded-full border border-current/15"
                    style={{ color: "var(--muted)" }}
                  >
                    {project.category}
                  </span>
                ) : (
                  <span />
                )}
                {project.year && (
                  <span
                    className="hidden text-[10px] uppercase tracking-[0.2em] font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {project.year}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className={`display-tight leading-tight ${
                  featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                }`}
              >
                {project.title}
                <span className="text-accent">.</span>
              </h3>
              {project.subtitle && (
                <p className="text-xl font-medium mt-2 cursive text-accent-strong tracking-wide">
                  {project.subtitle}
                </p>
              )}

              {/* Tech chips */}
              {project.tech?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-medium px-2 py-1 rounded-lg glass"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 5 && (
                    <span
                      className="text-[10px] font-medium px-2 py-1"
                      style={{ color: "var(--muted)" }}
                    >
                      +{project.tech.length - 5}
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
              <div
                className="mt-auto pt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-medium transition-colors group-hover:text-accent-strong"
                style={{ color: "var(--muted)" }}
              >
                <span>View Project</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

const VIEWS = [
  { key: "list", label: "List", Icon: Rows },
  { key: "grid", label: "Grid", Icon: LayoutGrid },
];

function ViewToggle({ view, setView }) {
  return (
    <div
      role="group"
      aria-label="Projects view"
      className="glass rounded-full p-1 inline-flex gap-1"
    >
      {VIEWS.map(({ key, label, Icon }) => {
        const isActive = view === key;
        return (
          <button
            key={key}
            onClick={() => setView(key)}
            aria-pressed={isActive}
            className="relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors"
            style={{ color: isActive ? "#0a0a0b" : "var(--muted)" }}
          >
            {isActive && (
              <motion.span
                layoutId="projectsViewPill"
                className="absolute inset-0 bg-accent rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
              />
            )}
            <Icon size={13} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectsSection({ projects = [] }) {
  const sectionRef = useRef(null);
  const [view, setView] = useState("list");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // No hover, no cursor preview — touch devices get the visual card grid
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) setView("grid");
  }, []);

  const mainProjects = projects.filter((p) => p.type !== "extension");
  const extensions = projects.filter((p) => p.type === "extension");

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div style={{ y: headlineY }} className="mb-10 text-center">
          <span className="eyebrow">Selected Work</span>
          <h2 className="display-tight text-4xl md:text-6xl mt-4 max-w-3xl mx-auto">
            Projects that pushed me to{" "}
            <span className="cursive text-accent-strong">level up</span>
            <span className="text-accent">.</span>
          </h2>
        </motion.div>

        <div className="flex justify-center md:justify-end mb-6">
          <ViewToggle view={view} setView={setView} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {view === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectShowcase projects={mainProjects} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {mainProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  featured={i === 0}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {extensions.length > 0 && (
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 text-center"
            >
              <span className="eyebrow">Browser Extensions & Mini Tools</span>
              <h3 className="display-tight text-2xl md:text-4xl mt-3 max-w-2xl mx-auto">
                Small things, shipped{" "}
                <span className="cursive text-accent-strong">sharp</span>
                <span className="text-accent">.</span>
              </h3>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {extensions.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
