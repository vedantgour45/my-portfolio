"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import Footer from "@/components/layout/Footer";

export default function ProjectDetailsPage({ params }) {
  const { slug } = params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-indigo-400 hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white min-h-screen font-sans selection:bg-orange-500/30">
      <main className="relative min-h-screen">
        {/* Cinematic Blurred Background - Less Intense */}
        <div className="absolute inset-0 z-0 h-[40vh] overflow-hidden">
          <Image
            src={project.image}
            alt="background"
            fill
            className="object-cover opacity-5 blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
          {/* Compact Split Hero */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16">
            {/* Left: Scaled Down Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 max-w-[320px] mx-auto lg:mx-0"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Right: Refined Title & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-8 space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter leading-none text-white uppercase">
                  {project.title}<span className="text-orange-500">.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 font-light italic tracking-wide opacity-70">
                  "{project.subtitle}"
                </p>
              </div>

              {/* Action Buttons - More Compact */}
              <div className="flex flex-wrap gap-3">
                <a 
                  href={project.demo} 
                  target="_blank" 
                  className="px-6 py-3 bg-white text-black rounded-full font-bold text-[9px] tracking-[0.2em] uppercase transition-all hover:bg-orange-500 hover:text-white flex items-center gap-2"
                >
                  <span className="text-base">▶</span> Launch Project
                </a>
                <a 
                  href={project.code} 
                  target="_blank" 
                  className="px-6 py-3 border border-white/10 rounded-full font-bold text-[9px] tracking-[0.2em] uppercase transition-all hover:bg-white/5 flex items-center gap-2"
                >
                  <span className="text-lg">⌨</span> Source Code
                </a>
              </div>

              {/* Tech Pills - Smaller */}
              <div className="flex flex-wrap gap-2 pt-2">
                 {project.tech.map(tech => (
                   <span key={tech} className="text-[8px] font-bold tracking-[0.2em] text-orange-500/70 border border-orange-500/10 px-3 py-1.5 rounded-full bg-orange-500/5 uppercase">
                     {tech}
                   </span>
                 ))}
              </div>
            </motion.div>
          </div>

          {/* Tighter Discovery & Build Section */}
          <div className="grid lg:grid-cols-12 gap-12 border-t border-white/5 pt-16">
            {/* Build Info */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.6em] text-orange-500 font-bold flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-orange-500" /> BUILD STRATEGY
                </h3>
                <p className="text-lg text-white font-light leading-relaxed">
                  Focused on <span className="text-orange-500 font-normal">performance</span> and intuitive UX.
                </p>
                <p className="text-gray-400 text-base font-light leading-relaxed">
                  Detailed modular implementation ensures a smooth, high-fidelity experience optimized for all devices.
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <h3 className="text-[10px] uppercase tracking-[0.6em] text-gray-400 font-bold">Concept</h3>
                <p className="text-base text-gray-400 leading-relaxed font-light italic">
                  {project.description}
                </p>
              </div>
            </motion.div>

            {/* Scaled Secondary Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-12 mt-4"
            >
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 shadow-lg group">
                <Image
                  src={project.image}
                  alt="detail"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />
              </div>
            </motion.div>
          </div>

          {/* More Restrained Footer */}
          <div className="pt-24 pb-12 text-center relative z-10">
              <Link 
                  href="/#projects"
                  className="text-gray-500 hover:text-white text-[9px] uppercase tracking-[0.4em] transition-all flex flex-col items-center gap-4 group font-bold"
              >
                  <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-orange-500 group-hover:h-20 transition-all duration-500" />
                  EXPLORE MORE
              </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
