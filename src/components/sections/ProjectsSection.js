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

import Link from "next/link";

function ProjectCard({ project, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={cardVariants}
      className="group relative aspect-square rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-orange-500/50 transition-all duration-500 cursor-pointer"
    >
      <Link href={`/project/${project.slug}`} className="block h-full w-full">
        {/* Project Image with Blur Effect */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm brightness-[0.8] group-hover:brightness-[0.4]"
        />

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/60 group-hover:to-black/40 transition-all duration-500" />

        {/* Sliding Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="flex flex-col items-center transform translate-y-[135px] group-hover:translate-y-0 transition-transform duration-700 cubic-bezier(0.22, 1, 0.36, 1)">
            <h3 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase">
              {project.title}
            </h3>
            <span className="text-[9px] uppercase tracking-[0.4em] text-orange-500 font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 mt-3">
              VIEW PROJECT DETAILS
            </span>
          </div>
        </div>

        {/* Interactive Border Effect */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-orange-500/50 transition-all rounded-2xl" />
      </Link>
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
            PORTFOLIO
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            PROJ<span className="text-gradient">.</span>ECTS
          </h2>
        </motion.div>

        {/* Project Grid - Now more compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
