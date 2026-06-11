"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Wrench,
  Route,
  FolderGit2,
  Mail,
  FileText,
  SunMoon,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { useLenis } from "@/components/layout/SmoothScroll";
import { setTheme, isDarkTheme } from "@/lib/theme";
import { getIcon } from "@/lib/icons";

const SECTION_ICONS = {
  home: Home,
  about: User,
  skills: Wrench,
  career: Route,
  projects: FolderGit2,
  contact: Mail,
};

const FALLBACK_NAV = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Work", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [nav, setNav] = useState(FALLBACK_NAV);
  const [socials, setSocials] = useState([]);
  const [personal, setPersonal] = useState({});
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith("/project/");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/nav").then((r) => r.json()),
      fetch("/api/socials").then((r) => r.json()),
      fetch("/api/personal").then((r) => r.json()),
    ])
      .then(([n, s, p]) => {
        if (cancelled) return;
        if (Array.isArray(n) && n.length) setNav(n);
        if (Array.isArray(s)) setSocials(s);
        if (p) setPersonal(p);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Open on Cmd/Ctrl+K or via the navbar hint button
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-cmdk", onOpen);
    };
  }, []);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    setQuery("");
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  const close = useCallback(() => setOpen(false), []);

  const goToSection = useCallback(
    (href) => {
      if (isProjectPage) {
        window.location.href = `/${href}`;
        return;
      }
      const el = document.getElementById(href.replace("#", ""));
      if (!el) return;
      history.pushState(null, "", href);
      if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.1 });
      else el.scrollIntoView();
    },
    [isProjectPage, lenis],
  );

  const items = useMemo(() => {
    const sections = nav.map((link) => ({
      group: "Navigate",
      label: link.name,
      hint: link.href,
      Icon: SECTION_ICONS[link.href.replace("#", "")] || Home,
      run: () => goToSection(link.href),
    }));

    const actions = [
      {
        group: "Actions",
        label: "Toggle theme",
        hint: "Dark / Light",
        Icon: SunMoon,
        run: () => setTheme(!isDarkTheme()),
      },
      {
        group: "Actions",
        label: "Download resume",
        hint: "PDF",
        Icon: FileText,
        run: () =>
          window.open(
            personal.resumePath || "/assets/resume.pdf",
            "_blank",
            "noopener",
          ),
      },
      {
        group: "Actions",
        label: "Email me",
        hint: personal.email || "",
        Icon: Mail,
        run: () => {
          window.location.href = `mailto:${personal.email || ""}`;
        },
      },
    ];

    const connect = socials.map((s) => ({
      group: "Connect",
      label: s.name,
      hint: "↗",
      Icon: getIcon(s.icon) || ArrowUpRight,
      run: () => window.open(s.url, "_blank", "noopener"),
    }));

    return [...sections, ...actions, ...connect];
  }, [nav, socials, personal, goToSection]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  const execute = useCallback(
    (item) => {
      close();
      // Let the overlay unmount before scrolling/navigating
      setTimeout(() => item.run(), 60);
    },
    [close],
  );

  // Keep the active option in view while arrowing through the list
  const moveActive = (next) => {
    setActiveIndex(next);
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector(`[data-idx="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
    });
  };

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) execute(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[300] flex items-start justify-center px-4 pt-[10vh] bg-black/50 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl overflow-hidden border shadow-2xl"
            style={{
              background: "var(--bg-elev)",
              borderColor: "var(--line)",
            }}
          >
            <div
              className="flex items-center gap-3 px-4 border-b"
              style={{ borderColor: "var(--line)" }}
            >
              <Search size={15} style={{ color: "var(--muted)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search sections, actions, links…"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:opacity-50"
                style={{ color: "var(--fg)" }}
              />
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded border shrink-0"
                style={{ color: "var(--muted)", borderColor: "var(--line)" }}
              >
                ESC
              </kbd>
            </div>

            <ul
              ref={listRef}
              // Lenis swallows wheel events globally (even while stopped);
              // this attribute tells it to leave this nested scroller alone.
              data-lenis-prevent=""
              className="max-h-[min(70vh,640px)] overflow-y-auto py-2"
              role="listbox"
              aria-label="Commands"
            >
              {filtered.length === 0 && (
                <li
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  No results for “{query}”
                </li>
              )}
              {filtered.map((item, i) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <li key={`${item.group}-${item.label}`}>
                    {showGroup && (
                      <div
                        className="px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.25em] font-medium"
                        style={{ color: "var(--muted)" }}
                      >
                        {item.group}
                      </div>
                    )}
                    <button
                      role="option"
                      data-idx={i}
                      aria-selected={i === activeIndex}
                      onClick={() => execute(item)}
                      onMouseMove={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                        i === activeIndex ? "bg-accent/10" : ""
                      }`}
                      style={{ color: "var(--fg)" }}
                    >
                      <item.Icon
                        size={15}
                        className={i === activeIndex ? "text-accent" : ""}
                        style={
                          i === activeIndex ? {} : { color: "var(--muted)" }
                        }
                      />
                      <span className="flex-1">{item.label}</span>
                      <span
                        className="text-[11px] truncate max-w-[140px]"
                        style={{ color: "var(--muted)" }}
                      >
                        {item.hint}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
