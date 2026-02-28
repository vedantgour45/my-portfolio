"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGestureContext } from "@/context/GestureContext";
import {
  Sparkles,
  MousePointer2,
  MoveVertical,
  CheckCircle2,
  XCircle,
  Camera,
  Layers,
  Touchpad,
  Hand,
  MousePointerClick,
  ScanFace,
  Magnet,
} from "lucide-react";

function useIsLight() {
  const [isLight, setIsLight] = useState(
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("light")
      : false,
  );

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isLight;
}

// ── Skeleton Connections ──
const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];

const INSTRUCTIONS = [
  {
    emoji: "☝️",
    action: "Move Cursor",
    desc: "Move your index finger to navigate the screen",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    emoji: "👌",
    action: "Click & Select",
    desc: "Pinch index finger and thumb to click buttons",
    color: "from-indigo-400 to-indigo-600",
    bg: "bg-indigo-500/10",
  },
  {
    emoji: "↕️",
    action: "Drag Scroll",
    desc: "Hold pinch and drag vertically to move the page",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-500/10",
  },
  {
    emoji: "👤",
    action: "Face Tracking",
    desc: "Move your head to tilt the 3D perspective",
    color: "from-cyan-400 to-cyan-600",
    bg: "bg-cyan-500/10",
  },
  {
    emoji: "✨",
    action: "Magnetic Skills",
    desc: "Hover over skill cards to pull them forward",
    color: "from-orange-400 to-orange-600",
    bg: "bg-orange-500/10",
  },
];

// ── Config ──
const SMOOTHING = 0.35; // Increased for faster response
const PINCH_THRESHOLD = 0.05; // Slightly tighter for accuracy
const PINCH_RELEASE = 0.07;
const DRAG_SCALE = 3.5; // Increased scroll sensitivity
const MOUSE_SENSITIVITY = 1.6; // Scale factor for cursor range

export default function GestureController() {
  const isLight = useIsLight();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const instructionsShown = useRef(false);
  const landmarker = useRef(null);
  const faceLandmarker = useRef(null);
  const { setGestureActive, setHeadRotation, setCursorPos, active, setActive } =
    useGestureContext();

  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  const isPinched = useRef(false);
  const dragActive = useRef(false);
  const initialPinchY = useRef(null);
  const lastPinchY = useRef(null);
  const lastClickTime = useRef(0);
  const gestureState = useRef("none");
  const cursorAnimId = useRef(null);

  const previousX = useRef(null);
  const previousTime = useRef(0);
  const streamRef = useRef(null);

  const isGesturing = active && !showInstructions;

  useEffect(() => {
    setGestureActive(isGesturing);
    // HIDE NATIVE CURSOR IMMEDIATELY WHEN TOGGLED
    document.documentElement.style.cursor = active ? "none" : "";
    document.body.style.cursor = active ? "none" : "";
    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, [active, isGesturing, setGestureActive]);

  // Handle mouse-to-cursor tracking during onboarding
  useEffect(() => {
    if (!active || !showInstructions) return;
    const updateTarget = (e) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
    };
    window.addEventListener("mousemove", updateTarget);
    return () => window.removeEventListener("mousemove", updateTarget);
  }, [active, showInstructions]);

  useEffect(() => {
    if (!active) {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      return;
    }
    const updateCursor = () => {
      smoothX.current += (targetX.current - smoothX.current) * SMOOTHING;
      smoothY.current += (targetY.current - smoothY.current) * SMOOTHING;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${smoothX.current}px, ${smoothY.current}px) translate(-50%, -50%)`;
        cursorRef.current.style.opacity = active ? "1" : "0";
      }
      cursorAnimId.current = requestAnimationFrame(updateCursor);
    };
    cursorAnimId.current = requestAnimationFrame(updateCursor);
    return () => cancelAnimationFrame(cursorAnimId.current);
  }, [active]);

  const doClick = useCallback((x, y) => {
    const now = Date.now();
    if (now - lastClickTime.current < 400) return;
    lastClickTime.current = now;
    cursorRef.current?.classList.add("gesture-click-flash");
    setTimeout(
      () => cursorRef.current?.classList.remove("gesture-click-flash"),
      250,
    );
    const el = document.elementFromPoint(x, y);
    if (el) {
      el.click();
    }
  }, []);

  const drawSkeletons = useCallback((handResults, faceLm, canvas, video) => {
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width,
      h = canvas.height;

    // Premium Face Mesh (Glowing Indigo)
    if (faceLm) {
      ctx.lineWidth = 1;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#818cf8";
      ctx.strokeStyle = "rgba(129, 140, 248, 0.6)";
      ctx.beginPath();
      FACE_OVAL.forEach((idx, i) => {
        const pt = faceLm[idx];
        if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
        else ctx.lineTo(pt.x * w, pt.y * h);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // High-Visibility Hand (Gradient Bones)
    if (handResults?.landmarks) {
      const handLm = handResults.landmarks[0];
      if (handLm) {
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        for (const [i, j] of HAND_CONNECTIONS) {
          const ax = handLm[i].x * w,
            ay = handLm[i].y * h;
          const bx = handLm[j].x * w,
            by = handLm[j].y * h;
          const grad = ctx.createLinearGradient(ax, ay, bx, by);
          grad.addColorStop(0, "#818cf8");
          grad.addColorStop(1, "#c084fc");
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
        for (let i = 0; i < handLm.length; i++) {
          ctx.beginPath();
          ctx.arc(handLm[i].x * w, handLm[i].y * h, 2, 0, Math.PI * 2);
          ctx.fillStyle = i === 4 || i === 8 ? "#fff" : "#818cf8";
          ctx.fill();
          if (i === 4 || i === 8) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#fff";
            ctx.beginPath();
            ctx.arc(handLm[i].x * w, handLm[i].y * h, 3.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }
    }
  }, []);

  // ── Pre-load MediaPipe on mount ──
  useEffect(() => {
    let isActive = true;
    const init = async () => {
      try {
        const { HandLandmarker, FaceLandmarker, FilesetResolver } =
          await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );

        const [hL, fL] = await Promise.all([
          HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 1,
          }),
          FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            outputFacialTransformationMatrixes: true,
            numFaces: 1,
          }),
        ]);

        if (isActive) {
          landmarker.current = hL;
          faceLandmarker.current = fL;
        }
      } catch (e) {
        console.error("MediaPipe Init Error:", e);
      }
    };
    init();
    return () => {
      isActive = false;
    };
  }, []);

  // ── Main Controller Loop ──
  useEffect(() => {
    if (!active) {
      instructionsShown.current = false;
      return;
    }

    // Show instructions immediately
    if (!instructionsShown.current) {
      setShowInstructions(true);
      instructionsShown.current = true;
    }

    let animationId,
      isActive = true;

    const start = async () => {
      setIsLoading(true);
      try {
        if (
          !window.isSecureContext &&
          window.location.hostname !== "localhost"
        ) {
          throw new Error(
            "Security Error: Gesture controls require a secure (HTTPS) connection.",
          );
        }

        // Wait for models if they aren't ready yet
        let attempts = 0;
        while (
          (!landmarker.current || !faceLandmarker.current) &&
          attempts < 50
        ) {
          if (!isActive) return;
          await new Promise((r) => setTimeout(r, 200));
          attempts++;
        }

        if (!landmarker.current || !faceLandmarker.current) {
          throw new Error(
            "Initialization failed: Hand/Face models could not be loaded. Please try again later.",
          );
        }

        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, frameRate: 30 },
          });
        } catch (mediaErr) {
          throw new Error(
            "Camera Access Denied: Please enable camera permissions to use gestures.",
          );
        }

        if (videoRef.current) videoRef.current.srcObject = streamRef.current;
        setIsLoading(false);
        setError(null);

        const loop = () => {
          if (
            !isActive ||
            !videoRef.current ||
            videoRef.current.readyState < 2
          ) {
            animationId = requestAnimationFrame(loop);
            return;
          }
          const now = Date.now();
          const handResults = landmarker.current.detectForVideo(
            videoRef.current,
            now,
          );
          const faceResults = faceLandmarker.current.detectForVideo(
            videoRef.current,
            now,
          );

          const hLm = handResults?.landmarks?.[0];
          const fLm = faceResults?.faceLandmarks?.[0];
          if (canvasRef.current)
            drawSkeletons(
              handResults,
              fLm,
              canvasRef.current,
              videoRef.current,
            );

          // Only process gestures if onboarding is dismissed
          if (isGesturing) {
            if (faceResults?.facialTransformationMatrixes?.[0]) {
              const m = faceResults.facialTransformationMatrixes[0].data;
              const yaw = Math.atan2(m[8], m[0]) * (180 / Math.PI);
              const pitch =
                Math.atan2(-m[4], Math.sqrt(m[5] * m[5] + m[6] * m[6])) *
                (180 / Math.PI);
              setHeadRotation({ yaw, pitch });
            }

            if (hLm) {
              const normalizedX = 1 - hLm[8].x;
              const normalizedY = hLm[8].y;
              const dist = Math.hypot(hLm[4].x - hLm[8].x, hLm[4].y - hLm[8].y);
              const isCurrentlyPinching = dist < PINCH_THRESHOLD;

              if (!isCurrentlyPinching && !isPinched.current) {
                targetX.current =
                  (0.5 + (normalizedX - 0.5) * MOUSE_SENSITIVITY) *
                  window.innerWidth;
                targetY.current =
                  (0.5 + (normalizedY - 0.5) * MOUSE_SENSITIVITY) *
                  window.innerHeight;
              }

              if (isCurrentlyPinching) {
                if (!isPinched.current) {
                  isPinched.current = true;
                  initialPinchY.current = hLm[8].y;
                  lastPinchY.current = hLm[8].y;
                  dragActive.current = false;
                } else {
                  const currentY = hLm[8].y;
                  if (
                    !dragActive.current &&
                    Math.abs(currentY - initialPinchY.current) > 0.025
                  ) {
                    dragActive.current = true;
                    gestureState.current = "drag";
                    lastPinchY.current = currentY;
                  }
                  if (dragActive.current) {
                    const deltaY = currentY - lastPinchY.current;
                    window.scrollBy({
                      top: deltaY * window.innerHeight * DRAG_SCALE,
                      behavior: "auto",
                    });
                    lastPinchY.current = currentY;
                  }
                }
              } else {
                if (isPinched.current) {
                  if (!dragActive.current)
                    doClick(smoothX.current, smoothY.current);
                  isPinched.current = false;
                  dragActive.current = false;
                  gestureState.current = "none";
                }
              }
            }
          }

          // Update global cursor position for components to react to
          if (isGesturing) {
            setCursorPos({
              x: smoothX.current / window.innerWidth,
              y: smoothY.current / window.innerHeight,
            });
          }

          if (cursorLabelRef.current) {
            cursorLabelRef.current.textContent = isPinched.current
              ? dragActive.current
                ? "DRAG"
                : "HOLD"
              : "●";
          }
          animationId = requestAnimationFrame(loop);
        };
        loop();
      } catch (e) {
        setError(
          e.message || "Currently facing some issue. Try after some time.",
        );
        setIsLoading(false);
      }
    };
    start();
    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
      // Stop all camera tracks — streamRef always holds the real stream even
      // if the toggle happened before the async getUserMedia call resolved.
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [active, doClick, drawSkeletons, setHeadRotation]);

  return (
    <>
      <AnimatePresence>
        {showInstructions && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[250] ${isLight ? "bg-white/40" : "bg-black/40"} backdrop-blur-2xl flex items-center justify-center p-4 md:p-6`}
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`max-w-2xl w-full ${isLight ? "bg-white/95" : "bg-[#0c0c0e]/95"} backdrop-blur-3xl border ${isLight ? "border-gray-200" : "border-white/10"} rounded-[2rem] overflow-hidden shadow-2xl relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - More Compact */}
              <div className="relative pt-8 pb-5 px-8 text-center border-b border-white/5 overflow-hidden">
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 ${isLight ? "bg-indigo-500/10" : "bg-indigo-500/20"} blur-[80px] rounded-full -mt-24 pointer-events-none`}
                />
                <span
                  className={`text-[9px] uppercase font-black ${isLight ? "text-indigo-600" : "text-indigo-400"} tracking-[0.4em]`}
                >
                  Control Guide
                </span>
                <h2
                  className={`text-3xl font-black mt-2 mb-1 tracking-tighter ${isLight ? "text-black" : "text-white"}`}
                >
                  HAND <span className="text-orange-500">CONTROLS</span>
                </h2>
                <p
                  className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-400"} font-medium uppercase tracking-[0.1em] max-w-sm mx-auto`}
                >
                  Master the cinematic hands-free interaction.
                </p>
              </div>

              {/* Grid Content - 2 Columns to save vertical space */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {INSTRUCTIONS.map((i, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    key={i.action}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300
                      ${
                        isLight
                          ? "bg-gray-50/50 border-gray-100"
                          : "bg-white/[0.03] border-white/5"
                      }
                    `}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${i.bg} flex items-center justify-center text-lg flex-shrink-0 shadow-sm border ${isLight ? "border-indigo-100/50" : "border-white/5"}`}
                    >
                      {i.emoji}
                    </div>
                    <div>
                      <h3
                        className={`font-black text-[10px] uppercase tracking-widest ${isLight ? "text-gray-900" : "text-white"} mb-1`}
                      >
                        {i.action}
                      </h3>
                      <p
                        className={`text-[10px] font-medium leading-tight ${isLight ? "text-gray-500" : "text-gray-400"} opacity-70`}
                      >
                        {i.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Confirmation Hint Card */}
                <div
                  className={`flex items-center justify-center p-4 rounded-2xl border border-dashed ${isLight ? "border-gray-200 bg-gray-50/20" : "border-white/10 bg-white/0"}`}
                >
                  <p
                    className={`text-[9px] font-bold uppercase tracking-widest text-center ${isLight ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Ready to <span className="text-orange-500">Explore?</span>
                  </p>
                </div>
              </div>

              {/* Action Button - More Compact */}
              <div
                className={`p-6 border-t ${isLight ? "border-gray-100 bg-gray-50/30" : "border-white/5 bg-black/20"} text-center`}
              >
                <button
                  onClick={() => setShowInstructions(false)}
                  className={`px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                    ${
                      isLight
                        ? "bg-black text-white hover:bg-indigo-600"
                        : "bg-indigo-500 text-white hover:bg-white hover:text-black"
                    }
                    hover:scale-[1.05] active:scale-95 shadow-lg
                  `}
                >
                  Start Experience
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={cursorRef} className="gesture-cursor" style={{ opacity: 0 }}>
        <div
          className={`gesture-cursor-ring ${isLight ? "border-indigo-600" : "border-indigo-400"}`}
        />
        <div
          className={`gesture-cursor-dot ${isLight ? "bg-indigo-600" : "bg-indigo-400"}`}
        />
        <span
          ref={cursorLabelRef}
          className={`gesture-cursor-label ${isLight ? "text-indigo-700" : "text-indigo-300"}`}
        >
          ●
        </span>
      </div>
      <div className="fixed bottom-6 right-6 z-[200]">
        <div
          className={`${isLight ? "bg-white/80 border-gray-200 shadow-xl" : "bg-[#0a0a0a]/90 border-white/10 shadow-2xl"} backdrop-blur-3xl rounded-[32px] p-5 border flex flex-col gap-4 min-w-[220px]`}
        >
          <div className="flex items-center justify-between px-1">
            <span
              className={`text-[10px] font-black ${isLight ? "text-indigo-600" : "text-indigo-400"} tracking-[0.3em] uppercase`}
            >
              Gestures
            </span>
            <button
              onClick={() => setActive(!active)}
              className={`w-12 h-6 rounded-full transition-all relative ${active ? "bg-indigo-500" : isLight ? "bg-gray-200" : "bg-white/10"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${active ? "left-7" : "left-1"}`}
              />
            </button>
          </div>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 130, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`relative overflow-hidden rounded-2xl border ${isLight ? "bg-gray-100 border-gray-200" : "bg-black border-white/10"} group`}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className={`absolute top-2 left-2 flex items-center gap-1.5 ${isLight ? "bg-white/80 border-gray-100" : "bg-black/60 border-white/10"} backdrop-blur-md px-2.5 py-1.5 rounded-full border`}
                >
                  <span
                    className={`w-1.5 h-1.5 ${isLight ? "bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" : "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)]"} rounded-full animate-pulse`}
                  />
                  <span
                    className={`text-[8px] font-black ${isLight ? "text-gray-900" : "text-white"} uppercase tracking-[0.1em]`}
                  >
                    Camera Feed
                  </span>
                </div>
                {isLoading && (
                  <div
                    className={`absolute inset-0 ${isLight ? "bg-white/60" : "bg-black/60"} backdrop-blur-sm flex flex-col items-center justify-center gap-2`}
                  >
                    <div
                      className={`w-4 h-4 border-2 ${isLight ? "border-indigo-600/30 border-t-indigo-600" : "border-indigo-500/30 border-t-indigo-500"} rounded-full animate-spin`}
                    />
                    <span
                      className={`text-[8px] font-bold ${isLight ? "text-gray-900" : "text-white"} uppercase tracking-widest animate-pulse`}
                    >
                      Initializing...
                    </span>
                  </div>
                )}
                {error && (
                  <div
                    className={`absolute inset-0 ${isLight ? "bg-white/90" : "bg-black/80"} backdrop-blur-md flex flex-col items-center justify-center p-4 text-center`}
                  >
                    <span className="text-xl mb-2">⚠️</span>
                    <span
                      className={`text-[9px] font-bold ${isLight ? "text-red-600" : "text-red-400"} uppercase tracking-widest leading-relaxed`}
                    >
                      {error}
                    </span>
                    <button
                      onClick={() => {
                        setError(null);
                        start();
                      }}
                      className={`mt-3 px-3 py-1.5 ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/20"} rounded-lg text-[8px] uppercase tracking-tighter font-bold transition-colors`}
                    >
                      Retry Connection
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
