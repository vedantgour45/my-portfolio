"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon, ExternalLink } from "lucide-react";

function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/* Browser-chrome viewer: screenshot by default, opt-in live iframe of the
   demo. The iframe only mounts when the user switches to Live — no
   third-party payload on page load. */
function ProjectViewer({ project }) {
  const hasImage = Boolean(project.image);
  const isExtension = project.type === "extension";
  // GitHub (extension releases) refuses framing — only offer Live for real deployments
  const canEmbed = Boolean(project.demo) && !isExtension;
  const [mode, setMode] = useState("shot");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div>
      <div className="glass rounded-3xl overflow-hidden border border-current/10">
        {/* Chrome bar */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 border-b"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="hidden sm:flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          </span>

          <span
            className="flex-1 min-w-0 truncate text-center text-[11px] font-medium tracking-wide rounded-full px-4 py-1.5"
            style={{
              color: "var(--muted)",
              background: "var(--bg)",
            }}
          >
            {project.demo ? hostnameOf(project.demo) : project.title}
          </span>

          {/* Mode tabs */}
          {canEmbed && (
            <span
              className="flex gap-1 rounded-full p-1 border border-current/15"
              role="group"
              aria-label="Viewer mode"
            >
              {[
                { key: "shot", label: "Shots", Icon: ImageIcon },
                { key: "live", label: "Live", Icon: Play },
              ].map(({ key, label, Icon }) => {
                const isActive = mode === key;
                return (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    aria-pressed={isActive}
                    className="relative rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.12em] font-semibold transition-colors"
                    style={{ color: isActive ? "#0a0a0b" : "var(--fg)" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="viewerModePill"
                        className="absolute inset-0 bg-accent rounded-full"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.45,
                        }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <Icon size={12} aria-hidden="true" />
                      {label}
                    </span>
                  </button>
                );
              })}
            </span>
          )}
        </div>

        {/* Stage */}
        <AnimatePresence mode="wait" initial={false}>
          {mode === "shot" ? (
            <motion.div
              key="shot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative aspect-[16/9]"
            >
              {hasImage ? (
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  style={{ viewTransitionName: `project-${project.slug}` }}
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative h-[440px] md:h-[620px]"
              style={{ background: "var(--bg)" }}
            >
              {!iframeLoaded && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ color: "var(--muted)" }}
                >
                  <span className="w-8 h-8 rounded-full border-2 border-current/20 border-t-accent animate-spin" />
                  <span className="text-xs tracking-wide">
                    Loading live preview…
                  </span>
                </div>
              )}
              <iframe
                src={project.demo}
                title={`${project.title} — live preview`}
                onLoad={() => setIframeLoaded(true)}
                className="relative w-full h-full"
                style={{ background: "#fff" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mode === "live" && (
        <p
          className="mt-3 text-[11px] tracking-wide text-center"
          style={{ color: "var(--muted)" }}
        >
          This is the real deployment running inside the page. Blank screen?
          Some hosts block embedding —{" "}
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-accent-strong transition-colors"
          >
            open it in a new tab
            <ExternalLink size={10} className="inline ml-1 -mt-0.5" />
          </a>
          .
        </p>
      )}
    </div>
  );
}

/* Prev/next pager — keeps the showcase's browsing flow going across detail pages */
function PagerLink({ project, direction }) {
  const isNext = direction === "next";
  return (
    <Link
      href={`/project/${project.slug}`}
      className={`group glass rounded-2xl p-4 md:p-5 flex items-center gap-4 transition-colors hover:border-accent/40 ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      {project.image && (
        <span className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden border border-current/10">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="96px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            style={{ viewTransitionName: `project-${project.slug}` }}
          />
        </span>
      )}
      <span className="min-w-0">
        <span
          className="block text-[10px] uppercase tracking-[0.25em] font-medium mb-1"
          style={{ color: "var(--muted)" }}
        >
          {isNext ? "Next project →" : "← Previous project"}
        </span>
        <span className="display-tight text-lg md:text-xl truncate block transition-colors group-hover:text-accent-strong">
          {project.title}
          <span className="text-accent">.</span>
        </span>
      </span>
    </Link>
  );
}

export default function ProjectDetail({ project, prevProject, nextProject }) {
  const hasDemo = Boolean(project.demo);
  const hasCode = Boolean(project.code);
  const isExtension = project.type === "extension";
  const demoLabel = isExtension ? "Install Extension" : "Launch Project";
  const codeLabel = isExtension ? "View on GitHub" : "Source Code";

  return (
    <div className="min-h-screen selection:bg-accent/30">
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
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium hover:text-accent-strong transition-colors"
              style={{ color: "var(--muted)" }}
            >
              <span aria-hidden="true">←</span>
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
              <span className="text-accent">.</span>
            </h1>
            {project.subtitle && (
              <p className="cursive text-xl md:text-2xl text-accent-strong">
                {project.subtitle}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <ProjectViewer project={project} />
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
                      <span>{demoLabel}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {hasCode && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                    >
                      {codeLabel}
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>

          {(prevProject || nextProject) && (
            <nav
              aria-label="More projects"
              className="grid sm:grid-cols-2 gap-4 border-t border-current/10 pt-8"
            >
              {prevProject ? (
                <PagerLink project={prevProject} direction="prev" />
              ) : (
                <span className="hidden sm:block" />
              )}
              {nextProject && (
                <PagerLink project={nextProject} direction="next" />
              )}
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}
