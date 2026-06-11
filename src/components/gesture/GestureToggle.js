"use client";

import { useState, useEffect } from "react";
import { useGestureContext } from "@/context/GestureContext";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, X } from "lucide-react";

const HINT_KEY = "gestureHintSeen";

export default function GestureToggle() {
  const { active, setActive } = useGestureContext();
  const [showHint, setShowHint] = useState(false);

  // One-time spotlight for first-time visitors — the gesture control is
  // the site's signature feature; make sure it gets noticed once.
  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_KEY)) return;
    } catch {
      return;
    }
    const show = setTimeout(() => setShowHint(true), 3500);
    const hide = setTimeout(() => dismissHint(), 16000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
  };

  const handleToggle = () => {
    dismissHint();
    setActive(!active);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200]"
    >
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl border p-4 shadow-2xl"
            style={{
              background: "var(--bg-elev)",
              borderColor: "var(--line)",
            }}
          >
            <button
              onClick={dismissHint}
              aria-label="Dismiss tip"
              className="absolute top-2.5 right-2.5 p-1 rounded-full transition-colors hover:text-accent-strong"
              style={{ color: "var(--muted)" }}
            >
              <X size={13} />
            </button>
            <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5">
              <span aria-hidden="true">✨</span> Try hand gestures
            </p>
            <p
              className="text-xs leading-relaxed font-light"
              style={{ color: "var(--muted)" }}
            >
              Browse this site by waving at your camera — point to move,
              pinch to click. Everything runs on-device; no video ever
              leaves your browser.
            </p>
            {/* Arrow */}
            <span
              aria-hidden="true"
              className="absolute -bottom-[5px] right-9 w-2.5 h-2.5 rotate-45 border-b border-r"
              style={{
                background: "var(--bg-elev)",
                borderColor: "var(--line)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        aria-label={
          active ? "Disable gesture controls" : "Enable gesture controls"
        }
        aria-pressed={active}
        title={active ? "Disable gestures" : "Enable hand-gesture controls"}
        className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.2em] font-medium border transition-all backdrop-blur-xl ${
          active
            ? "bg-accent text-ink-900 border-accent shadow-lg shadow-accent/30"
            : "bg-current/[0.04] border-current/15 hover:border-accent/50 hover:text-accent-strong"
        }`}
      >
        <Hand size={14} aria-hidden="true" />
        <span>{active ? "Gestures on" : "Try gestures"}</span>
        {!active && showHint && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
        )}
      </button>
    </motion.div>
  );
}
