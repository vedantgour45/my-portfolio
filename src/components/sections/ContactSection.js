"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { socials, personalInfo } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">
            CONTACT
          </span>
          <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter text-white">
            GET<span className="text-gradient">.</span>IN TOUCH
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info Card */}
          <div className="contact-card lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-8 border-white/5">
              <h3 className="text-3xl font-black mb-2 text-white">
                {" "}
                Vedant Gour
              </h3>
              <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs mb-6">
                {personalInfo.role}
              </p>
              <p className="text-gray-400 leading-relaxed text-sm mb-8 font-light">
                Available for frontend developer roles and freelance
                opportunities. Let&apos;s build something extraordinary
                together.
              </p>

              <div className="border-t border-white/5 pt-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">
                  CONNECT.LINKS
                </p>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full glass px-4 py-2.5 text-[11px] text-gray-400 hover:text-orange-500 hover:border-orange-500/30 transition-all border-white/5"
                    >
                      <social.icon size={14} />
                      <span className="hidden sm:inline">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-card lg:col-span-3">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass rounded-3xl p-8 flex flex-col gap-5 border-white/5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                  Message
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="Tell me about your project..."
                  className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all resize-none text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl text-[11px] uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-orange-500/20 transition-all mt-2 shadow-none flex items-center justify-center gap-2"
              >
                {submitted ? "✓ Message Sent" : "→ Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
