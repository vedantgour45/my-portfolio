"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import GestureToggle from "@/components/gesture/GestureToggle";
import CommandPalette from "@/components/layout/CommandPalette";
import { GestureProvider, useGestureContext } from "@/context/GestureContext";

// Heavy MediaPipe controller — only loads when user opts in.
const GestureController = dynamic(
  () => import("@/components/gesture/GestureController"),
  { ssr: false, loading: () => null },
);

function GestureMount() {
  const { active } = useGestureContext();
  return active ? <GestureController /> : null;
}

export default function ClientLayout({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <GestureProvider>
        <SmoothScroll>
          <Navbar />
          {children}
          <CommandPalette />
          <GestureToggle />
          <GestureMount />
        </SmoothScroll>
      </GestureProvider>
    </MotionConfig>
  );
}
