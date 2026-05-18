"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectDetail({ project }) {
  const hasImage = Boolean(project.image);
  const hasDemo = Boolean(project.demo);
  const hasCode = Boolean(project.code);

  return (
    <div className="min-h-screen selection:bg-orange-500/30">
      <main className="relative">
        <div className="relative max-w-6xl mx-auto px-6 pt-24 lg:pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-medium hover:text-orange-400 transition-colors"
              style={{ color: "var(--muted)" }}
            >
              <span>←</span>
              Back to Work
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            {(project.category || project.year) && (
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {project.category && (
                  <span className="text-[10px] uppercase tracking-[0.25em] font-medium px-3 py-1.5 rounded-full border border-current/10">
                    {project.category}
                  </span>
                )}
                {project.year && (
                  <span
                    className="text-[10px] hidden uppercase tracking-[0.3em] font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {project.year}
                  </span>
                )}
              </div>
            )}

            <h1 className="display-tight text-5xl md:text-7xl lg:text-8xl mb-3">
              {project.title}
              <span className="text-orange-500">.</span>
            </h1>
            {project.subtitle && (
              <p className="cursive text-xl md:text-2xl text-orange-400">
                {project.subtitle}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 border border-current/10"
          >
            {hasImage ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-indigo-500/10" />
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-3xl pointer-events-none" />
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            <div className="lg:col-span-7">
              {project.description && (
                <>
                  <span className="eyebrow">Concept</span>
                  <p
                    className="text-lg md:text-xl leading-relaxed font-light mt-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {project.description}
                  </p>
                </>
              )}
            </div>

            <aside className="lg:col-span-5 lg:pl-8 lg:border-l border-current/10 space-y-8">
              {project.tech?.length > 0 && (
                <div>
                  <span className="eyebrow">Stack</span>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-current/15"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(hasDemo || hasCode) && (
                <div className="flex flex-col gap-3 pt-2">
                  {hasDemo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <span>Launch Project</span>
                      <span>↗</span>
                    </a>
                  )}
                  {hasCode && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                    >
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
