"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GSAPSetup() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Refresh ScrollTrigger on window resize
    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
  }, []);

  return null;
}
