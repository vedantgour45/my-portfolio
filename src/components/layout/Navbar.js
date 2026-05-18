"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

const FALLBACK_NAV = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Work", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const FALLBACK_PERSONAL = {
  name: "Vedant Gour",
  logo: "/assets/main-logo2-white.png",
  logoLight: "/assets/main-logo2.png",
};

export default function Navbar() {
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith("/project/");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [nav, setNav] = useState(FALLBACK_NAV);
  const [personal, setPersonal] = useState(FALLBACK_PERSONAL);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  // Fetch nav links + personal from API
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/nav").then((r) => r.json()),
      fetch("/api/personal").then((r) => r.json()),
    ])
      .then(([n, p]) => {
        if (cancelled) return;
        if (Array.isArray(n) && n.length) setNav(n);
        if (p) setPersonal(p);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Restore theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved ? saved === "dark" : true;
    setIsDark(prefersDark);
    document.documentElement.classList.add(prefersDark ? "dark" : "light");
    document.documentElement.classList.remove(prefersDark ? "light" : "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (!isProjectPage) {
        const sections = nav.map((l) => l.href.replace("#", ""));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProjectPage, nav]);

  const scrollToSection = useCallback(
    (e, href) => {
      e.preventDefault();
      if (isProjectPage) {
        window.location.href = `/${href}`;
        return;
      }
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;
      setMobileOpen(false);

      const targetY = el.getBoundingClientRect().top + window.scrollY - 64;
      const startY = window.scrollY;
      const diff = targetY - startY;
      const duration = Math.min(1100, Math.max(550, Math.abs(diff) * 0.45));
      let startTime = null;
      const ease = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const step = (ts) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / duration, 1);
        window.scrollTo(0, startY + diff * ease(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    [isProjectPage],
  );

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX, width: "100%" }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? "py-3 bg-black/40 dark:bg-black/40 backdrop-blur-xl border-b border-white/5"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center gap-3 group"
          >
            <Image
              src={isDark ? personal.logo : personal.logoLight || personal.logo}
              alt="Logo"
              width={32}
              height={32}
              priority
              style={{ width: 32, height: 32 }}
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {nav.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors group ${
                    isActive
                      ? "text-current"
                      : "text-current/60 hover:text-current"
                  }`}
                  style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-orange-500 transition-all duration-300 ${
                      isActive ? "w-6" : "w-0 group-hover:w-4"
                    }`}
                  />
                </a>
              );
            })}

            <button
              onClick={toggleTheme}
              className="ml-3 w-9 h-9 rounded-full border border-current/10 flex items-center justify-center hover:border-orange-500/50 transition-all text-sm"
              aria-label="Toggle theme"
            >
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ y: -10, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 10, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? "☀" : "◑"}
              </motion.span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-300"
            aria-label="Menu"
          >
            <span
              className={`w-6 h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "rotate-45 translate-y-[8px] bg-orange-500"
                  : "bg-current"
              }`}
            />
            <span
              className={`w-6 h-[2px] rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-6 h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "-rotate-45 -translate-y-[8px] bg-orange-500"
                  : "bg-current"
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] bg-ink-900/95 backdrop-blur-3xl flex flex-col items-center justify-center"
            style={{ background: "var(--bg)" }}
          >
            <div className="relative z-10 flex flex-col items-center gap-6">
              {nav.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="display text-5xl md:text-6xl tracking-tightest hover:text-orange-500 transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + nav.length * 0.08 }}
                onClick={toggleTheme}
                className="mt-8 flex items-center gap-3 px-6 py-3 rounded-full border border-current/20 hover:border-orange-500/50 transition-all"
              >
                <span className="text-sm">{isDark ? "☀" : "◑"}</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.25em]">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
