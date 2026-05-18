"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGestureContext } from "@/context/GestureContext";

export default function AboutSection({ personal }) {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const { gestureActive, headRotation } = useGestureContext();

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // Head-tilt 3D effect
  useEffect(() => {
    if (!imageContainerRef.current) return;
    if (gestureActive) {
      const rotX = -headRotation.pitch * 0.8;
      const rotY = headRotation.yaw * 0.8;
      imageContainerRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      imageContainerRef.current.style.transition = "transform 0.15s ease-out";
    } else {
      imageContainerRef.current.style.transform = "";
      imageContainerRef.current.style.transition = "transform 0.5s ease-out";
    }
  }, [gestureActive, headRotation]);

  return (
    <section id="about" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto">
        {/* Centered header */}
        <div className="mb-10 text-center">
          <span className="eyebrow">About</span>
          <h2 className="display-tight text-4xl md:text-6xl mt-4 max-w-3xl mx-auto">
            Building polished frontend experiences with{" "}
            <span className="cursive text-orange-400">
              attention to every detail
            </span>{" "}
            <span className="text-orange-500">.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Image */}
          <motion.div
            style={{ y: imgY }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <div
              ref={imageContainerRef}
              className="relative aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={personal.profileImage}
                alt={personal.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div style={{ y: textY }} className="lg:col-span-7 space-y-6">
            <div className="space-y-5 max-w-xl">
              {personal.about.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="leading-relaxed text-base md:text-lg font-light"
                  style={{ color: "var(--muted)" }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-current/10">
              {personal.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                >
                  <div className="display text-4xl md:text-5xl">
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.25em] mt-2"
                    style={{ color: "var(--muted)" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href={personal.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost group"
              >
                <span>Download Resume</span>
                <span className="inline-block transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
