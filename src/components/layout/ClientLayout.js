"use client";

import CustomCursor from "@/components/layout/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import GestureController from "@/components/gesture/GestureController";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { GestureProvider } from "@/context/GestureContext";

export default function ClientLayout({ children }) {
  return (
    <GestureProvider>
      <CustomCursor />
      <Navbar />
      <GestureController />
      <SmoothScroll>{children}</SmoothScroll>
    </GestureProvider>
  );
}
