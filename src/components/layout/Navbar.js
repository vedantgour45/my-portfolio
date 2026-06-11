"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/layout/SmoothScroll";
import { setTheme } from "@/lib/theme";

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
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [metaKey, setMetaKey] = useState(null);
  const [nav, setNav] = useState(FALLBACK_NAV);
  const [personal, setPersonal] = useState(FALLBACK_PERSONAL);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);

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

  // The inline script in layout.js applies the saved theme pre-paint (no
  // flash). React can still clobber the <html> class with the hardcoded JSX
  // value on some route renders (e.g. not-found), so re-apply it on mount,
  // and track external changes (e.g. the command palette toggling).
  useEffect(() => {
    let dark = true;
    try {
      const saved = localStorage.getItem("theme");
      dark = saved ? saved === "dark" : true;
    } catch {}
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    setIsDark(dark);
    setMetaKey(
      /mac/i.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl",
    );
    const onThemeChange = (e) => setIsDark(e.detail.dark);
    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
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

  // Mobile menu: lock background scroll + close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, lenis]);

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

      // Deep-linkable sections
      history.pushState(null, "", href);

      if (lenis) {
        lenis.scrollTo(el, { offset: -64, duration: 1.1 });
      } else {
        // Reduced motion / Lenis unavailable — jump without animation
        el.scrollIntoView();
        window.scrollBy(0, -64);
      }
    },
    [isProjectPage, lenis],
  );

  const toggleTheme = () => {
    setTheme(!isDark);
  };

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("open-cmdk"));
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
        aria-label="Main navigation"
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? "py-3 nav-scrolled" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => scrollToSection(e, "#home")}
            aria-label="Home"
            className="flex items-center gap-3 group"
          >
            <Image
              src={isDark ? personal.logo : personal.logoLight || personal.logo}
              alt=""
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
                  aria-current={isActive ? "true" : undefined}
                  className="relative px-4 py-2 text-xs uppercase tracking-[0.18em] font-medium transition-colors group"
                  style={{ color: isActive ? "var(--fg)" : "var(--muted)" }}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-accent transition-all duration-300 ${
                      isActive ? "w-6" : "w-0 group-hover:w-4"
                    }`}
                  />
                </a>
              );
            })}

            <button
              onClick={openPalette}
              aria-label="Open command menu"
              className="ml-3 hidden lg:inline-flex items-center gap-1.5 rounded-full border border-current/10 px-3 py-2 text-[11px] font-medium tracking-wide hover:border-accent/50 transition-all"
              style={{ color: "var(--muted)" }}
            >
              <kbd className="font-sans">{metaKey || "⌘"}</kbd>
              <kbd className="font-sans">K</kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="ml-2 w-9 h-9 rounded-full border border-current/10 flex items-center justify-center hover:border-accent/50 transition-all text-sm"
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ y: -10, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 10, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {isDark ? "☀" : "◑"}
              </motion.span>
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            ref={menuButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-300"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`w-6 h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "rotate-45 translate-y-[8px] bg-accent"
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
                  ? "-rotate-45 -translate-y-[8px] bg-accent"
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
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] backdrop-blur-3xl flex flex-col items-center justify-center"
            style={{ background: "var(--bg)" }}
          >
            <div className="relative z-10 flex flex-col items-center gap-6">
              {nav.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  key={link.name}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="display text-5xl md:text-6xl tracking-tightest hover:text-accent transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + nav.length * 0.08 }}
                onClick={toggleTheme}
                className="mt-8 flex items-center gap-3 px-6 py-3 rounded-full border border-current/20 hover:border-accent/50 transition-all"
              >
                <span className="text-sm" aria-hidden="true">
                  {isDark ? "☀" : "◑"}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em]">
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
