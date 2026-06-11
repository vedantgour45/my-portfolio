"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGestureContext } from "@/context/GestureContext";
import { useLenis } from "@/components/layout/SmoothScroll";
import { setTheme, isDarkTheme } from "@/lib/theme";
import { Camera } from "lucide-react";

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
    desc: "Hold pinch and drag vertically — flick for momentum",
    color: "from-purple-400 to-purple-600",
    bg: "bg-purple-500/10",
  },
  {
    emoji: "🖐↔️",
    action: "Swipe Sections",
    desc: "Open palm, flick left or right to jump between sections",
    color: "from-sky-400 to-sky-600",
    bg: "bg-sky-500/10",
  },
  {
    emoji: "✊🖐",
    action: "Burst Shuffle",
    desc: "Make a fist, then snap it open to scatter the floating icons",
    color: "from-amber-400 to-orange-600",
    bg: "bg-amber-500/10",
  },
  {
    emoji: "✌️",
    action: "Shuffle Skills",
    desc: "Flash a peace sign to re-deal the skill cards",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    emoji: "👍",
    action: "Celebrate",
    desc: "Thumbs up anywhere for a confetti burst",
    color: "from-green-400 to-green-600",
    bg: "bg-green-500/10",
  },
  {
    emoji: "🤟",
    action: "Switch Theme",
    desc: "Sign “I love you” to flip dark / light",
    color: "from-pink-400 to-pink-600",
    bg: "bg-pink-500/10",
  },
  {
    emoji: "👤",
    action: "Face Tracking",
    desc: "Move your head to tilt the 3D perspective",
    color: "from-cyan-400 to-cyan-600",
    bg: "bg-cyan-500/10",
  },
];

/* ── Config — tuning knobs ─────────────────────────────────────────
   SMOOTHING            display-rate lerp toward the filtered target
   PINCH_ENTER/EXIT     thumb–index distance as a fraction of palm
                        length (wrist→middle knuckle): hysteresis so
                        the pinch can't flicker at the boundary
   DRAG_SCALE           scroll px per normalized hand movement
   MOUSE_SENSITIVITY    cursor range amplification
   FILTER_*             One Euro filter: MIN_CUTOFF lower = steadier
                        when still, BETA higher = snappier when fast
   GESTURE_HOLD_FRAMES  frames a named gesture must persist to count
   *_COOLDOWN_MS        re-fire guards per action
   SWIPE_VELOCITY       palm speed (screen-widths/s) that counts as
                        a swipe
   MOMENTUM_PROJECTION  seconds of release velocity carried by the
                        post-drag glide                              */
const SMOOTHING = 0.35;
const PINCH_ENTER = 0.38;
const PINCH_EXIT = 0.55;
const DRAG_SCALE = 3.5;
const MOUSE_SENSITIVITY = 1.6;
const FILTER_MIN_CUTOFF = 1.1;
const FILTER_BETA = 0.006;
const GESTURE_HOLD_FRAMES = 5;
const GESTURE_COOLDOWN_MS = 1500;
const FIST_BURST_WINDOW_MS = 1500;
const SWIPE_VELOCITY = 1.5;
const SWIPE_COOLDOWN_MS = 1500;
const MOMENTUM_PROJECTION = 0.45;
const MOMENTUM_MIN_VELOCITY = 250;

/* One Euro filter — adaptive smoothing for pointing: heavy when the
   hand is still (kills jitter), light when it moves fast (kills lag). */
class OneEuroFilter {
  constructor(minCutoff = FILTER_MIN_CUTOFF, beta = FILTER_BETA, dCutoff = 1) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.xPrev = null;
    this.dxPrev = 0;
    this.tPrev = null;
  }
  alpha(cutoff, dt) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }
  filter(x, tMs) {
    if (this.tPrev === null) {
      this.tPrev = tMs;
      this.xPrev = x;
      return x;
    }
    const dt = Math.max((tMs - this.tPrev) / 1000, 1e-3);
    this.tPrev = tMs;
    const dx = (x - this.xPrev) / dt;
    const aD = this.alpha(this.dCutoff, dt);
    this.dxPrev = aD * dx + (1 - aD) * this.dxPrev;
    const cutoff = this.minCutoff + this.beta * Math.abs(this.dxPrev);
    const a = this.alpha(cutoff, dt);
    this.xPrev = a * x + (1 - a) * this.xPrev;
    return this.xPrev;
  }
  reset() {
    this.xPrev = null;
    this.dxPrev = 0;
    this.tPrev = null;
  }
}

const CONFETTI_COLORS = ["#fb923c", "#f97316", "#fde68a", "#a7f3d0", "#c4b5fd"];

function ConfettiBurst({ x, y }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 60 + Math.random() * 90;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 50,
          rot: 90 + Math.random() * 270,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          w: 5 + Math.random() * 4,
          dur: 1 + Math.random() * 0.3,
        };
      }),
    [],
  );
  return (
    <>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-[2px]"
          style={{
            left: x,
            top: y,
            width: p.w,
            height: p.w * 0.6,
            background: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.dx,
            y: p.dy + 130,
            opacity: 0,
            rotate: p.rot,
            scale: 0.6,
          }}
          transition={{ duration: p.dur, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </>
  );
}

export default function GestureController() {
  const isLight = useIsLight();
  const lenis = useLenis();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const instructionsShown = useRef(false);
  const recognizer = useRef(null);
  const faceLandmarker = useRef(null);
  const {
    setGestureActive,
    setHeadRotation,
    setCursorPos,
    setShuffleTrigger,
    setSkillsShuffleTrigger,
    active,
  } = useGestureContext();

  const smoothX = useRef(0);
  const smoothY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const filterX = useRef(new OneEuroFilter());
  const filterY = useRef(new OneEuroFilter());

  const isPinched = useRef(false);
  const dragActive = useRef(false);
  const initialPinchY = useRef(null);
  const lastPinchY = useRef(null);
  const lastClickTime = useRef(0);
  const cursorAnimId = useRef(null);
  const dragVelocity = useRef(0); // px/s, smoothed
  const lastFrameTime = useRef(0);
  const handMissingFrames = useRef(0);

  // Named-gesture state machine
  const pendingGesture = useRef({ name: "None", count: 0 });
  const lastMeaningful = useRef({ name: "None", at: 0 });
  const actionTimes = useRef({});

  // Swipe tracking (palm-center x velocity)
  const previousX = useRef(null);
  const previousTime = useRef(0);
  const swipeVel = useRef(0);
  const lastSwipe = useRef(0);

  // Synthetic hover target
  const lastHoverEl = useRef(null);

  const [facingMode, setFacingMode] = useState("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const streamRef = useRef(null);

  const isGesturing = active && !showInstructions;

  useEffect(() => {
    setGestureActive(isGesturing);
  }, [isGesturing, setGestureActive]);

  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (e) {
        setHasMultipleCameras(false);
      }
    };
    checkCameras();
  }, []);

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
    if (el && typeof el.click === "function") {
      el.click();
    }
  }, []);

  const spawnConfetti = useCallback((x, y) => {
    const id = Date.now();
    setConfetti((b) => [...b, { id, x, y }]);
    setTimeout(() => setConfetti((b) => b.filter((bb) => bb.id !== id)), 1500);
  }, []);

  // Swipe → prev/next pager on project pages, prev/next section on home
  const handleSwipe = useCallback(
    (dir) => {
      const pager = document.querySelector('nav[aria-label="More projects"]');
      if (pager) {
        const target = [...pager.querySelectorAll("a")].find((a) =>
          dir === "left"
            ? a.textContent.includes("Next")
            : a.textContent.includes("Previous"),
        );
        if (target) {
          target.click();
          return;
        }
      }
      const sections = [...document.querySelectorAll("section[id]")];
      if (!sections.length) return;
      let currentIdx = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= 120) currentIdx = i;
      });
      const nextIdx = Math.min(
        Math.max(currentIdx + (dir === "left" ? 1 : -1), 0),
        sections.length - 1,
      );
      const el = sections[nextIdx];
      history.pushState(null, "", `#${el.id}`);
      if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.1 });
      else el.scrollIntoView();
    },
    [lenis],
  );

  // Fire an action at most once per cooldown window
  const fireAction = useCallback((key, fn, cooldown = GESTURE_COOLDOWN_MS) => {
    const now = Date.now();
    if (now - (actionTimes.current[key] || 0) < cooldown) return;
    actionTimes.current[key] = now;
    fn();
  }, []);

  // A named gesture became stable (held GESTURE_HOLD_FRAMES frames)
  const onStableGesture = useCallback(
    (name) => {
      if (name === "None") return;
      const now = Date.now();
      const prev = lastMeaningful.current;

      if (
        name === "Open_Palm" &&
        prev.name === "Closed_Fist" &&
        now - prev.at < FIST_BURST_WINDOW_MS
      ) {
        fireAction("burst", () => setShuffleTrigger((t) => t + 1));
      } else if (name === "Victory") {
        fireAction("skills", () => setSkillsShuffleTrigger((t) => t + 1), 2000);
      } else if (name === "Thumb_Up") {
        fireAction(
          "confetti",
          () => spawnConfetti(smoothX.current, smoothY.current),
          1200,
        );
      } else if (name === "ILoveYou") {
        fireAction("theme", () => setTheme(!isDarkTheme()), 3000);
      }

      lastMeaningful.current = { name, at: now };
    },
    [fireAction, setShuffleTrigger, setSkillsShuffleTrigger, spawnConfetti],
  );

  // Replay the gesture cursor as real hover events so spotlights and
  // hover previews respond to the hand exactly like they do to a mouse.
  const dispatchHover = useCallback((x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const opts = { bubbles: true, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent("mousemove", opts));
    if (el !== lastHoverEl.current) {
      lastHoverEl.current?.dispatchEvent(
        new MouseEvent("mouseout", { ...opts, relatedTarget: el }),
      );
      el.dispatchEvent(
        new MouseEvent("mouseover", {
          ...opts,
          relatedTarget: lastHoverEl.current,
        }),
      );
      lastHoverEl.current = el;
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
        const { GestureRecognizer, FaceLandmarker, FilesetResolver } =
          await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );

        // GestureRecognizer = HandLandmarker landmarks + classified
        // gestures (Open_Palm, Closed_Fist, Victory, Thumb_Up, ILoveYou…)
        const [gR, fL] = await Promise.all([
          GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
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
          recognizer.current = gR;
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

    let animationId;
    let vfcId;
    let isActive = true;
    const videoElement = videoRef.current;
    const supportsVFC =
      typeof HTMLVideoElement !== "undefined" &&
      "requestVideoFrameCallback" in HTMLVideoElement.prototype;

    // Run detection once per camera frame (~30fps), not per display
    // frame (up to 120fps) — same fidelity, much less main-thread work.
    const schedule = (cb) => {
      if (!isActive) return;
      if (supportsVFC && videoRef.current) {
        vfcId = videoRef.current.requestVideoFrameCallback(() => cb());
      } else {
        animationId = requestAnimationFrame(cb);
      }
    };

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
          (!recognizer.current || !faceLandmarker.current) &&
          attempts < 50
        ) {
          if (!isActive) return;
          await new Promise((r) => setTimeout(r, 200));
          attempts++;
        }

        if (!recognizer.current || !faceLandmarker.current) {
          throw new Error(
            "Initialization failed: Hand/Face models could not be loaded. Please try again later.",
          );
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              frameRate: { ideal: 30 },
              facingMode: facingMode,
            },
          });

          if (!isActive) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = stream;
        } catch (mediaErr) {
          throw new Error(
            "Camera Access Denied: Please enable camera permissions to use gestures.",
          );
        }

        if (videoRef.current) videoRef.current.srcObject = streamRef.current;
        setIsLoading(false);
        setError(null);

        const loop = () => {
          if (!isActive) return;
          if (!videoRef.current || videoRef.current.readyState < 2) {
            schedule(loop);
            return;
          }
          const now = Date.now();
          const dtSec = Math.max((now - lastFrameTime.current) / 1000, 1e-3);
          lastFrameTime.current = now;

          const results = recognizer.current.recognizeForVideo(
            videoRef.current,
            now,
          );
          const faceResults = faceLandmarker.current.detectForVideo(
            videoRef.current,
            now,
          );

          const hLm = results?.landmarks?.[0];
          const fLm = faceResults?.faceLandmarks?.[0];
          if (canvasRef.current)
            drawSkeletons(results, fLm, canvasRef.current, videoRef.current);

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
              handMissingFrames.current = 0;

              // ── Named-gesture state machine: a classification must
              // hold for GESTURE_HOLD_FRAMES consecutive frames ──
              const gestureName =
                results?.gestures?.[0]?.[0]?.categoryName || "None";
              if (gestureName === pendingGesture.current.name) {
                pendingGesture.current.count++;
                if (pendingGesture.current.count === GESTURE_HOLD_FRAMES) {
                  onStableGesture(gestureName);
                }
              } else {
                pendingGesture.current = { name: gestureName, count: 1 };
              }

              const normalizedX = 1 - hLm[8].x;
              const normalizedY = hLm[8].y;

              // ── Pinch, normalized by palm length so it works at any
              // distance from the camera, with hysteresis ──
              const palm =
                Math.hypot(hLm[0].x - hLm[9].x, hLm[0].y - hLm[9].y) || 1e-6;
              const pinchRatio =
                Math.hypot(hLm[4].x - hLm[8].x, hLm[4].y - hLm[8].y) / palm;
              const isCurrentlyPinching = isPinched.current
                ? pinchRatio < PINCH_EXIT
                : pinchRatio < PINCH_ENTER;

              if (!isCurrentlyPinching && !isPinched.current) {
                const rawX =
                  (0.5 + (normalizedX - 0.5) * MOUSE_SENSITIVITY) *
                  window.innerWidth;
                const rawY =
                  (0.5 + (normalizedY - 0.5) * MOUSE_SENSITIVITY) *
                  window.innerHeight;
                targetX.current = filterX.current.filter(rawX, now);
                targetY.current = filterY.current.filter(rawY, now);
              }

              if (isCurrentlyPinching) {
                if (!isPinched.current) {
                  isPinched.current = true;
                  initialPinchY.current = hLm[8].y;
                  lastPinchY.current = hLm[8].y;
                  dragActive.current = false;
                  dragVelocity.current = 0;
                } else {
                  const currentY = hLm[8].y;
                  if (
                    !dragActive.current &&
                    Math.abs(currentY - initialPinchY.current) > 0.025
                  ) {
                    dragActive.current = true;
                    lastPinchY.current = currentY;
                  }
                  if (dragActive.current) {
                    const deltaY = currentY - lastPinchY.current;
                    const deltaPx = deltaY * window.innerHeight * DRAG_SCALE;
                    window.scrollBy({ top: deltaPx, behavior: "auto" });
                    // Smoothed release velocity for the momentum glide
                    dragVelocity.current =
                      dragVelocity.current * 0.7 + (deltaPx / dtSec) * 0.3;
                    lastPinchY.current = currentY;
                  }
                }
              } else {
                if (isPinched.current) {
                  if (!dragActive.current) {
                    doClick(smoothX.current, smoothY.current);
                  } else if (
                    lenis &&
                    Math.abs(dragVelocity.current) > MOMENTUM_MIN_VELOCITY
                  ) {
                    // Flick: carry the release velocity into a glide
                    lenis.scrollTo(
                      window.scrollY +
                        dragVelocity.current * MOMENTUM_PROJECTION,
                      { duration: 1.1 },
                    );
                  }
                  isPinched.current = false;
                  dragActive.current = false;
                  dragVelocity.current = 0;
                }
              }

              // ── Open-palm swipe: palm-center x velocity ──
              if (gestureName === "Open_Palm" && !isPinched.current) {
                const cx = 1 - hLm[9].x;
                if (previousX.current !== null) {
                  const v = (cx - previousX.current) / dtSec;
                  swipeVel.current = swipeVel.current * 0.7 + v * 0.3;
                  if (
                    Math.abs(swipeVel.current) > SWIPE_VELOCITY &&
                    now - lastSwipe.current > SWIPE_COOLDOWN_MS
                  ) {
                    lastSwipe.current = now;
                    const dir = swipeVel.current > 0 ? "right" : "left";
                    swipeVel.current = 0;
                    handleSwipe(dir);
                  }
                }
                previousX.current = cx;
                previousTime.current = now;
              } else {
                previousX.current = null;
                swipeVel.current = 0;
              }

              // Hover replay — skip while dragging to avoid noise
              if (!dragActive.current) {
                dispatchHover(smoothX.current, smoothY.current);
              }
            } else {
              // Hand lost — after ~0.5s let the filters re-acquire from
              // scratch instead of gliding across the whole screen
              handMissingFrames.current++;
              if (handMissingFrames.current === 15) {
                filterX.current.reset();
                filterY.current.reset();
              }
              previousX.current = null;
              swipeVel.current = 0;
              pendingGesture.current = { name: "None", count: 0 };
            }
          }

          // Update global cursor position for components to react to
          if (isGesturing) {
            setCursorPos({
              x: smoothX.current / window.innerWidth,
              y: smoothY.current / window.innerHeight,
            });
          }

          schedule(loop);
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
      if (supportsVFC && videoElement && vfcId) {
        videoElement.cancelVideoFrameCallback?.(vfcId);
      }
      // Stop all camera tracks — streamRef always holds the real stream even
      // if the toggle happened before the async getUserMedia call resolved.
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoElement) videoElement.srcObject = null;
    };
  }, [
    active,
    doClick,
    drawSkeletons,
    setHeadRotation,
    isGesturing,
    setCursorPos,
    facingMode,
    lenis,
    onStableGesture,
    handleSwipe,
    dispatchHover,
  ]);

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
              className={`max-w-xl w-full max-h-[90vh] flex flex-col ${isLight ? "bg-white/95" : "bg-[#0c0c0e]/95"} backdrop-blur-3xl border ${isLight ? "border-gray-200" : "border-white/10"} rounded-[2rem] overflow-hidden shadow-2xl relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - ultra-compact on mobile */}
              <div className="relative pt-4 md:pt-8 pb-3 md:pb-5 px-5 md:px-8 text-center border-b border-white/5 overflow-hidden flex-shrink-0">
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 ${isLight ? "bg-indigo-500/10" : "bg-indigo-500/20"} blur-[80px] rounded-full -mt-24 pointer-events-none`}
                />
                <span
                  className={`text-[7px] md:text-[9px] uppercase font-black ${isLight ? "text-indigo-600" : "text-indigo-400"} tracking-[0.4em]`}
                >
                  Control Guide
                </span>
                <h2
                  className={`text-xl md:text-3xl font-black mt-0.5 mb-0.5 tracking-tighter ${isLight ? "text-black" : "text-white"}`}
                >
                  HAND <span className="text-orange-500">CONTROLS</span>
                </h2>
                <p
                  className={`text-[7px] md:text-[10px] ${isLight ? "text-gray-500" : "text-gray-400"} font-medium uppercase tracking-[0.1em] max-w-xs mx-auto`}
                >
                  Master the cinematic hands-free interaction.
                </p>
              </div>

              {/* Grid Content - Perfect scrolling (data-lenis-prevent so
                  the wheel works inside while Lenis runs the page) */}
              <div
                data-lenis-prevent=""
                className="p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3 overflow-y-auto"
              >
                {INSTRUCTIONS.map((i, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * idx }}
                    key={i.action}
                    className={`flex items-center gap-2 md:gap-4 p-2.5 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300
                      ${
                        isLight
                          ? "bg-gray-50/50 border-gray-100"
                          : "bg-white/[0.03] border-white/5"
                      }
                    `}
                  >
                    <div
                      className={`w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl ${i.bg} flex items-center justify-center text-sm md:text-lg flex-shrink-0 shadow-sm border ${isLight ? "border-indigo-100/50" : "border-white/5"}`}
                    >
                      {i.emoji}
                    </div>
                    <div>
                      <h3
                        className={`font-black text-[8px] md:text-[10px] uppercase tracking-widest ${isLight ? "text-gray-900" : "text-white"} mb-0`}
                      >
                        {i.action}
                      </h3>
                      <p
                        className={`text-[8px] md:text-[10px] font-medium leading-tight ${isLight ? "text-gray-500" : "text-gray-400"} opacity-70`}
                      >
                        {i.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Confirmation Hint - Hidden on mobile to save space */}
                <div
                  className={`hidden md:flex items-center justify-center p-4 rounded-2xl border border-dashed ${isLight ? "border-gray-200 bg-gray-50/20" : "border-white/10 bg-white/0"}`}
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
                className={`p-3 md:p-6 border-t ${isLight ? "border-gray-100 bg-gray-50/30" : "border-white/5 bg-black/20"} text-center flex-shrink-0`}
              >
                <button
                  onClick={() => setShowInstructions(false)}
                  className={`w-full md:w-auto px-6 py-2.5 md:px-10 md:py-3 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all
                    ${
                      isLight
                        ? "bg-black text-white hover:bg-indigo-600"
                        : "bg-indigo-500 text-white hover:bg-white hover:text-black"
                    }
                    hover:scale-[1.02] active:scale-95 shadow-lg
                  `}
                >
                  Start Experience
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti bursts (👍) */}
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {confetti.map((b) => (
          <ConfettiBurst key={b.id} x={b.x} y={b.y} />
        ))}
      </div>

      {/* Fiery Gesture Cursor - Igniting Hand Tracking */}
      <div
        ref={cursorRef}
        className="gesture-cursor pointer-events-none select-none"
        style={{
          opacity: active ? (isGesturing ? 1 : 0.4) : 0,
          visibility: active ? "visible" : "hidden",
        }}
      >
        {/* Intense heat-glow core */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2">
          {/* Inner core */}
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 via-orange-500 to-amber-600 shadow-[0_0_15px_rgba(249,115,22,0.8)]" />

          {/* Pulsing outer corona */}
          <div className="absolute inset-0 w-8 h-8 -translate-x-[11px] -translate-y-[11px] rounded-full border border-orange-500/30 animate-pulse bg-orange-500/10 blur-[2px]" />

          {/* Ambient heat rays */}
          <div className="absolute inset-0 w-12 h-12 -translate-x-[19px] -translate-y-[19px] rounded-full bg-gradient-radial from-orange-500/20 to-transparent blur-md opacity-60" />
        </div>
      </div>
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[199]">
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-2xl border w-[180px] h-[130px] sm:w-[220px] sm:h-[160px] ${isLight ? "bg-gray-100 border-gray-200" : "bg-black border-white/10"} group shadow-2xl`}
            >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity -scale-x-100"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover -scale-x-100"
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
                {active && hasMultipleCameras && (
                  <button
                    onClick={() =>
                      setFacingMode((prev) =>
                        prev === "user" ? "environment" : "user",
                      )
                    }
                    className={`absolute top-2 right-2 p-1.5 rounded-full border shadow-sm transition-all z-20 ${isLight ? "bg-white/80 border-gray-200 text-indigo-600 hover:bg-white" : "bg-black/60 border-white/10 text-indigo-400 hover:bg-black/80"}`}
                    title="Switch Camera"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                )}
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
                      onClick={() => setError(null)}
                      className={`mt-3 px-3 py-1.5 ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/20"} rounded-lg text-[8px] uppercase tracking-tighter font-bold transition-colors`}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
