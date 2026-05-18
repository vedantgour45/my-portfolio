"use client";

import { useGestureContext } from "@/context/GestureContext";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";

export default function GestureToggle() {
  const { active, setActive } = useGestureContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200]"
    >
      <button
        onClick={() => setActive(!active)}
        aria-label={active ? "Disable gesture controls" : "Enable gesture controls"}
        title={active ? "Disable gestures" : "Enable hand-gesture controls"}
        className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.25em] font-medium border transition-all backdrop-blur-xl ${
          active
            ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
            : "bg-current/[0.04] border-current/15 hover:border-orange-500/50 hover:text-orange-400"
        }`}
      >
        <Hand size={14} />
        <span>{active ? "Gestures on" : "Try gestures"}</span>
      </button>
    </motion.div>
  );
}
