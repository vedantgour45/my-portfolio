"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function ProjectCard({ project, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      className="group relative rounded-3xl overflow-hidden bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-500"
    >
      {/* Project Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-indigo-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            PROJECT_{String(project.id).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-1 tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 group-hover:bg-clip-text transition-all">
          {project.title}
        </h3>
        <p className="text-sm text-indigo-400 font-medium mb-4">
          {project.subtitle}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 font-medium tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-2"
          >
            <span className="w-5 h-[1px] bg-indigo-500" /> Live Demo
          </a>
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <span className="w-5 h-[1px] bg-white/20" /> Source
          </a>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute -inset-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-indigo-400 font-bold">
            PORTFOLIO
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            PROJECT<span className="text-gradient">.</span>LOG
          </h2>
        </motion.div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
