"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { navLinks, personalInfo } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith("/project/");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(true);

  // Restore theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved ? saved === "dark" : true;
    setIsDark(prefersDark);
    document.documentElement.classList.add(prefersDark ? "dark" : "light");
    document.documentElement.classList.remove(prefersDark ? "light" : "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isProjectPage) {
        // Detect active section
        const sections = navLinks.map((l) => l.href.replace("#", ""));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.getBoundingClientRect().top <= 200) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProjectPage]);

  const scrollToSection = useCallback(
    (e, href) => {
      e.preventDefault();

      // If we are on a project page and clicking a hash link, go back to home
      if (isProjectPage) {
        window.location.href = `/${href}`;
        return;
      }

      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (!el) return;

      setMobileOpen(false);

      // Smooth scroll with easing
      const targetY = el.getBoundingClientRect().top + window.scrollY - 50;
      const startY = window.scrollY;
      const diff = targetY - startY;
      const duration = Math.min(1200, Math.max(600, Math.abs(diff) * 0.5));
      let startTime = null;

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startY + diff * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    },
    [isProjectPage],
  );

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    // Persist to localStorage
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? "py-3 navbar-scrolled" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex flex-col items-start gap-1">
            <a
              href="/"
              onClick={(e) => scrollToSection(e, "#home")}
              className="flex items-center gap-3 group"
            >
              <Image
                src={isDark ? personalInfo.logo : "/assets/main-logo2.png"}
                alt="Logo"
                width={36}
                height={36}
                style={{ width: "36px", height: "36px" }}
              />
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-5 py-2 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors group ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-orange-500 to-purple-500 transition-all duration-300 ${
                      isActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                  />
                </a>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-4 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-sm shadow-none bg-transparent overflow-hidden"
              aria-label="Toggle theme"
            >
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? "☀" : "◑"}
              </motion.span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${mobileOpen ? "text-orange-500" : isDark ? "text-white" : "text-black"}`}
            aria-label="Menu"
          >
            <span
              className={`w-6 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[8px]" : ""}`}
            />
            <span
              className={`w-6 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 " : "opacity-100"}`}
            />
            <span
              className={`w-6 h-[2px] bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 z-[99] ${isDark ? "bg-[#0a0a0b]/95" : "bg-white/95"} backdrop-blur-3xl flex flex-col items-center justify-center`}
          >
            {/* Cinematic background glow inside menu */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-orange-500/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    scrollToSection(e, link.href);
                    setMobileOpen(false);
                  }}
                  className={`text-xl font-black uppercase tracking-[0.4em] transition-all duration-300 hover:text-orange-500 ${isDark ? "text-white/80" : "text-black/80"}`}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.1 }}
                onClick={toggleTheme}
                className={`mt-6 flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-black/5 border-black/10 text-black hover:bg-black/10"}`}
              >
                <span className="text-sm">{isDark ? "☀" : "◑"}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
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
