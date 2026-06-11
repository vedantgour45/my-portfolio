"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/layout/SmoothScroll";
import { getIcon } from "@/lib/icons";

export default function Footer({ personal = {}, socials = [] }) {
  const lenis = useLenis();
  const [localTime, setLocalTime] = useState(null);

  // Local time in IST — client-only to avoid hydration mismatch
  useEffect(() => {
    const tick = () => {
      setLocalTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-current/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="eyebrow justify-center">Next step</span>
          <h2 className="display-tight text-3xl md:text-5xl mt-4 mb-7 max-w-2xl mx-auto">
            Have an idea?{" "}
            <span className="cursive text-accent-strong">
              Let&apos;s build it
            </span>{" "}
            together<span className="text-accent">.</span>
          </h2>
        </motion.div>

        {/* Socials + back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-8 border-b border-current/10">
          <div className="flex gap-2 flex-wrap justify-center">
            {socials.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-current/10 px-4 py-2 text-xs font-medium hover:border-accent/50 hover:text-accent-strong transition-all"
                >
                  {Icon && <Icon size={13} aria-hidden="true" />}
                  <span>{s.name}</span>
                </a>
              );
            })}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-full border border-current/10 px-4 py-2 text-xs uppercase tracking-[0.18em] font-medium hover:border-accent/50 hover:text-accent-strong transition-all"
          >
            <span>Back to top</span>
            <ArrowUp size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Bottom row — centered so it never hides behind the floating
            gesture pill in the bottom-right corner */}
        <div
          className="pt-8 flex flex-col items-center gap-2 text-center text-xs tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          <p>
            Designed &amp; built by{" "}
            <span style={{ color: "var(--fg)" }}>
              {personal.name || "Vedant Gour"}
            </span>{" "}
            &middot; &copy; {new Date().getFullYear()}
          </p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            {personal.location || "Pune, India"}
            {localTime && (
              <span aria-label="Local time">· {localTime} IST</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
