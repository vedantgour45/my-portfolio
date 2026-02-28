"use client";

import { createContext, useContext, useState } from "react";

const GestureContext = createContext({
  gestureActive: false,
  setGestureActive: () => {},
  active: false,
  setActive: () => {},
  headRotation: { yaw: 0, pitch: 0 },
  setHeadRotation: () => {},
  shuffleTrigger: 0,
  setShuffleTrigger: () => {},
});

export function GestureProvider({ children }) {
  const [gestureActive, setGestureActive] = useState(false);
  const [active, setActive] = useState(false);
  const [headRotation, setHeadRotation] = useState({ yaw: 0, pitch: 0 });
  const [shuffleTrigger, setShuffleTrigger] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });

  return (
    <GestureContext.Provider
      value={{
        gestureActive,
        setGestureActive,
        active,
        setActive,
        headRotation,
        setHeadRotation,
        shuffleTrigger,
        setShuffleTrigger,
        cursorPos,
        setCursorPos,
      }}
    >
      {children}
    </GestureContext.Provider>
  );
}

export function useGestureContext() {
  return useContext(GestureContext);
}
