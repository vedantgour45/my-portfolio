"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo } from "@/lib/data";
import { useGestureContext } from "@/context/GestureContext";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textRef = useRef(null);
  const { gestureActive, headRotation } = useGestureContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });
      gsap.from(textRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Apply head rotation to the image container for 3D tilt effect
  useEffect(() => {
    if (!imageContainerRef.current) return;

    if (gestureActive) {
      // Map head yaw → rotateY, pitch → rotateX (inverted for natural feel)
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
    <section
      id="about"
      ref={sectionRef}
      className="py-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
            PROFILE
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            ABOUT<span className="text-gradient">.</span>ME
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with 3D head-tilt effect */}
          <div ref={imageRef} className="relative group">
            <div
              ref={imageContainerRef}
              className="relative w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Face tracking indicator */}
              {gestureActive && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-[8px] text-orange-500 font-bold uppercase tracking-wider">
                    Face Tracking Enabled
                  </span>
                </div>
              )}
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-orange-500/20 rounded-3xl max-w-md mx-auto" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border border-orange-500/30 rounded-2xl" />
          </div>

          {/* Text */}
          <div ref={textRef} className="space-y-6">
            <h3 className="text-4xl font-black tracking-tight text-white uppercase">
              {personalInfo.name}
              <span className="block text-lg text-orange-500 font-medium mt-1 uppercase tracking-[0.2em] font-bold">
                {personalInfo.role}
              </span>
            </h3>

            {personalInfo.about.map((p, i) => (
              <p
                key={i}
                className="text-gray-400 leading-relaxed text-lg font-light"
              >
                {p}
              </p>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {personalInfo.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={personalInfo.resumePath}
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 glass rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-all mt-4"
            >
              <span>↓</span> Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
