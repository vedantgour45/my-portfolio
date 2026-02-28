"use client";

import { useEffect, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useGestureContext } from "@/context/GestureContext";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { gestureActive, active } = useGestureContext();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isVisible, mouseX, mouseY]);

  // Hide when gesture mode is toggled or active, or cursor hasn't been detected yet
  if (!isVisible || gestureActive || active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000]">
      {/* Outer ring */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
          scale: isHovering ? 2.5 : 1,
        }}
        className="fixed w-10 h-10 border border-indigo-500 rounded-full flex items-center justify-center transition-transform duration-300"
      >
        <motion.div
          animate={{ scale: isHovering ? 0 : 1 }}
          className="w-1 h-1 bg-indigo-500 rounded-full"
        />
      </motion.div>

      {/* Internal "Eye" Dot */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
        }}
        className="fixed w-2 h-2 bg-indigo-500 rounded-full z-10 opacity-30 blur-sm"
      />

      {/* Hover effect indicator without text */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ left: cursorX, top: cursorY }}
            className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
