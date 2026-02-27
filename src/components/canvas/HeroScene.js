"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Floating Particle Cloud ──────────────────────────────── */
function ParticleCloud({ count = 3000 }) {
  const mesh = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.04;
    mesh.current.rotation.x = t * 0.02;
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
        size={0.06}
        color="#818cf8"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Morphing Sphere ──────────────────────────────────────── */
function MorphSphere() {
  const mesh = useRef();
  const geo = useRef();

  // Store original positions
  const originalPositions = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.4, 20);
    return g.attributes.position.array.slice();
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Animate sphere rotation
    mesh.current.rotation.x = Math.cos(t / 4) * 0.3;
    mesh.current.rotation.y = Math.sin(t / 3) * 0.3;
    mesh.current.position.y = Math.sin(t / 2) * 0.3;

    // Distort vertices
    if (geo.current) {
      const positions = geo.current.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const noise =
          Math.sin(ox * 2 + t * 2) * 0.08 +
          Math.sin(oy * 3 + t * 1.5) * 0.06 +
          Math.sin(oz * 4 + t) * 0.04;
        const scale = 1 + noise;
        positions[i] = (ox / len) * len * scale;
        positions[i + 1] = (oy / len) * len * scale;
        positions[i + 2] = (oz / len) * len * scale;
      }
      geo.current.attributes.position.needsUpdate = true;
      geo.current.computeVertexNormals();
    }
  });

  return (
    <group>
      {/* Solid distorted sphere */}
      <mesh ref={mesh}>
        <icosahedronGeometry ref={geo} args={[1.4, 20]} />
        <meshStandardMaterial
          color="#818cf8"
          roughness={0.2}
          metalness={0.8}
          emissive="#4338ca"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh rotation={[0.1, 0.2, 0]}>
        <icosahedronGeometry args={[1.55, 8]} />
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ── Starfield Background ─────────────────────────────────── */
function Starfield({ count = 5000 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 100;
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
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Orbital Rings ────────────────────────────────────────── */
function OrbitalRing({ radius = 2.5, tilt = 0, speed = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.z = state.clock.getElapsedTime() * speed * 0.3;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 16, 100]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.25} />
    </mesh>
  );
}

/* ── Main Scene Export ────────────────────────────────────── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          color="#818cf8"
        />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#e879f9" />

        <Suspense fallback={null}>
          <MorphSphere />
          <ParticleCloud />
          <Starfield />
          <OrbitalRing radius={2.8} tilt={1.2} speed={0.8} />
          <OrbitalRing radius={3.2} tilt={0.6} speed={-0.5} />
          <OrbitalRing radius={2.2} tilt={-0.8} speed={1.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
