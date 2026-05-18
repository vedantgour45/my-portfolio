"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

function ProjectCard({ project, index }) {
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
      className="group"
    >
      <Link
        href={`/project/${project.slug}`}
        prefetch
        className="block h-full"
        aria-label={`View project: ${project.title}`}
      >
        <article className="relative h-full glass rounded-2xl p-5 transition-all duration-300 group-hover:border-orange-500/40 overflow-hidden">
          {/* Hover accent glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.12),transparent_70%)]" />

          <div className="relative flex flex-col h-full">
            {/* Top meta */}
            <div className="flex items-center justify-between mb-5">
              {project.category ? (
                <span
                  className="text-[9px] uppercase tracking-[0.25em] font-medium px-2 py-1 rounded-full border border-current/15"
                  style={{ color: "var(--muted)" }}
                >
                  {project.category}
                </span>
              ) : (
                <span />
              )}
              {project.year && (
                <span
                  className="hidden text-[9px] uppercase tracking-[0.25em] font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {project.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="display-tight text-xl md:text-2xl leading-tight">
              {project.title}
              <span className="text-orange-500">.</span>
            </h3>
            {project.subtitle && (
              <p
                className="text-[11px] uppercase tracking-widest font-medium mt-2"
                style={{ color: "var(--muted)" }}
              >
                {project.subtitle}
              </p>
            )}

            {/* Tech chips */}
            {project.tech?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
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
              className="mt-auto pt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-medium transition-colors group-hover:text-orange-400"
              style={{ color: "var(--muted)" }}
            >
              <span>View Project</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export default function ProjectsSection({ projects = [] }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div style={{ y: headlineY }} className="mb-10 text-center">
          <span className="eyebrow">Selected Work</span>
          <h2 className="display-tight text-4xl md:text-6xl mt-4 max-w-3xl mx-auto">
            Projects that pushed me to{" "}
            <span className="cursive text-orange-400">level up</span>
            <span className="text-orange-500">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
