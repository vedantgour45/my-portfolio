"use client";

import { useEffect, useState } from "react";
import { initializeHandLandmarker, getLandmarks } from "@/lib/gesture";

export function useGesture(videoRef) {
  const [gesture, setGesture] = useState("None");
  const [landmarks, setLandmarks] = useState(null);

  useEffect(() => {
    let animationId;
    let isActive = true;

    const loop = () => {
      if (!isActive || !videoRef.current) return;
      
      if (videoRef.current.readyState >= 2) {
        const results = getLandmarks(videoRef.current);
        if (results && results.landmarks && results.landmarks.length > 0) {
          setLandmarks(results.landmarks[0]);
          setGesture("Detected");
        } else {
          setGesture("None");
          setLandmarks(null);
        }
      }
      animationId = requestAnimationFrame(loop);
    };

    if (videoRef.current) loop();

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
    };
  }, [videoRef]);

  return { gesture, landmarks };
}
