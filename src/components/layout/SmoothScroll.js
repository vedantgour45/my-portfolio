"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP Integration (optional, but requested for ScrollTrigger)
    // import gsap from "gsap";
    // import { ScrollTrigger } from "gsap/ScrollTrigger";
    // gsap.registerPlugin(ScrollTrigger);
    // lenis.on("scroll", ScrollTrigger.update);
    // ScrollTrigger.scrollerProxy(document.body, {
    //   scrollTop(value) {
    //     return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
    //   },
    //   getBoundingClientRect() {
    //     return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    //   },
    // });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
