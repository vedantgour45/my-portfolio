"use client";

import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGestureContext } from "@/context/GestureContext";

/* ── Hook: reads the theme from the HTML element class (set by Navbar) ── */
function useIsLight() {
  const [isLight, setIsLight] = useState(
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("light")
      : false,
  );

  useEffect(() => {
    // Re-sync after mount
    setIsLight(document.documentElement.classList.contains("light"));

    // Watch for class changes (theme toggle)
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

/* ── Floating Particle Cloud ──────────────────────────────── */
function ParticleCloud({ count = 2000 }) {
  const mesh = useRef();
  const isLight = useIsLight();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isLight ? 0.15 : 0.1}
        color={isLight ? "#64748b" : "#fb923c"}
        transparent
        opacity={isLight ? 0.4 : 0.6}
        sizeAttenuation
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Interactive Kinetic Core ──────────────────────────────── */
function InteractiveCore() {
  const mainMesh = useRef();
  const fragmentsRef = useRef();
  const { headRotation } = useGestureContext();
  const isLight = useIsLight();

  // Vertex data for morphing
  const originalPos = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1.5, 4);
    return geo.attributes.position.array.slice();
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const targetYaw = headRotation.yaw * 0.01;
    const targetPitch = headRotation.pitch * 0.01;

    mainMesh.current.rotation.y = t * 0.15 + targetYaw;
    mainMesh.current.rotation.x = Math.sin(t * 0.2) * 0.1 + targetPitch;

    if (mainMesh.current.geometry) {
      const pos = mainMesh.current.geometry.attributes.position.array;

      for (let i = 0; i < pos.length; i += 3) {
        const ox = originalPos[i];
        const oy = originalPos[i + 1];
        const oz = originalPos[i + 2];

        const noise =
          Math.sin(ox * 1.5 + t * 0.8) * 0.06 +
          Math.cos(oy * 2 + t * 0.5) * 0.04;

        const scale = 1 + noise;
        pos[i] = ox * scale;
        pos[i + 1] = oy * scale;
        pos[i + 2] = oz * scale;
      }
      mainMesh.current.geometry.attributes.position.needsUpdate = true;
      mainMesh.current.geometry.computeVertexNormals();
    }

    if (fragmentsRef.current) {
      fragmentsRef.current.rotation.y = t * 0.08;
      fragmentsRef.current.position.y = Math.sin(t * 0.4) * 0.05;
    }

    mainMesh.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.01);
  });

  const mainColor = "#fb923c";

  return (
    <group>
      <mesh ref={mainMesh}>
        <octahedronGeometry args={[1.5, 4]} />
        <meshPhysicalMaterial
          color={mainColor}
          transmission={0.95}
          thickness={1}
          roughness={0.02}
          metalness={0.1}
          envMapIntensity={1}
          clearcoat={1}
          transparent
          opacity={isLight ? 0.4 : 0.7}
        />
      </mesh>

      <group ref={fragmentsRef}>
        {[...Array(6)].map((_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 2) * 3, Math.cos(i * 2) * 3, 0]}
            rotation={[Math.random(), Math.random(), Math.random()]}
          >
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color={mainColor}
              transparent
              opacity={isLight ? 0.05 : 0.15}
              wireframe
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ── Starfield Background ─────────────────────────────────── */
function Starfield({ count = 4000 }) {
  const isLight = useIsLight();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isLight ? 0.15 : 0.18}
        color={isLight ? "#94a3b8" : "#ffffff"}
        transparent
        opacity={isLight ? 0.3 : 0.4}
        sizeAttenuation
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Main Scene Export ────────────────────────────────────── */
export default function HeroScene() {
  const isLight = useIsLight();
  const { headRotation } = useGestureContext();

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isLight ? 1.0 : 0.4} />

        <pointLight
          position={[headRotation.yaw * 0.1, headRotation.pitch * 0.1, 10]}
          intensity={2}
          color="#fb923c"
        />

        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#f97316"
        />

        <Suspense fallback={null}>
          <ParticleCloud />
          <Starfield />
        </Suspense>
      </Canvas>
    </div>
  );
}
