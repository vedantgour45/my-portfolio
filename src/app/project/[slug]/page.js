"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import Footer from "@/components/layout/Footer";

function useIsLight() {
  const [isLight, setIsLight] = useState(
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("light")
      : false,
  );

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isLight;
}

export default function ProjectDetailsPage({ params }) {
  const { slug } = params;
  const project = projects.find((p) => p.slug === slug);
  const isLight = useIsLight();

  if (!project) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/" className="text-indigo-400 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-transparent ${isLight ? "text-gray-900" : "text-white"} min-h-screen font-sans selection:bg-orange-500/30`}
    >
      <main className="relative min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 lg:pt-30">
          {/* Standing Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <Link
              href="/#projects"
              className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all inline-flex items-center gap-2 ${
                isLight
                  ? "bg-gray-100 text-gray-900 hover:bg-orange-500 hover:text-white border border-gray-200 shadow-sm"
                  : "bg-white/5 text-white hover:bg-orange-500 border border-white/10"
              }`}
            >
              ← Back to Projects
            </Link>
          </motion.div>
          {/* Compact Split Hero */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-16">
            {/* Left: Scaled Down Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-4 max-w-[320px] mx-auto lg:mx-0"
            >
              <div
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-500 group
                  ${
                    isLight
                      ? "border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
                      : "border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_40px_80px_rgba(249,115,22,0.15)]"
                  }
                  hover:-translate-y-2
                `}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                <h1
                  className={`text-4xl md:text-6xl font-black mb-3 tracking-tighter leading-none uppercase ${isLight ? "text-gray-900" : "text-white"}`}
                >
                  {project.title}
                  <span className="text-orange-500">.</span>
                </h1>
                <p
                  className={`text-lg md:text-xl font-light italic tracking-wide opacity-70 ${isLight ? "text-gray-700" : "text-gray-300"}`}
                >
                  &quot;{project.subtitle}&quot;
                </p>
              </div>

              {/* Action Buttons - More Compact */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={project.demo}
                  target="_blank"
                  className={`px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${isLight ? "bg-gray-900 text-white hover:bg-orange-600 shadow-md" : "bg-white text-black hover:bg-orange-500 hover:text-white"}`}
                >
                  Launch Project
                </a>
                <a
                  href={project.code}
                  target="_blank"
                  className={`px-6 py-3 border rounded-full font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-white hover:bg-white/5"}`}
                >
                  Source Code
                </a>
              </div>

              {/* Tech Pills - Below buttons */}
              <div className="flex flex-wrap gap-2 ms-50">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-bold tracking-tight text-orange-500/90 border border-orange-500/60 px-3 py-1 rounded-full bg-orange-500/10 uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Concept Section */}
              <div className="pt-3 space-y-4 ms-1">
                <h3 className="text-md tracking-wide text-orange-500 font-bold flex items-center gap-3">
                  Concept
                </h3>

                <p
                  className={`text-base leading-relaxed font-light italic ${isLight ? "text-gray-800" : "text-gray-300"}`}
                >
                  {project.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
