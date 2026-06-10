"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function FloatingTorus() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const { x, y } = state.mouse;
    meshRef.current.rotation.x = t * 0.18 + y * 0.4;
    meshRef.current.rotation.y = t * 0.22 + x * 0.4;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={meshRef} position={[1.6, 0.2, 0]} scale={1.15}>
        <torusKnotGeometry args={[0.9, 0.28, 220, 32]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#8B5CF6"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
    </Float>
  );
}

function FloatingIcosahedron() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const { x, y } = state.mouse;
    meshRef.current.rotation.x = -t * 0.15 - y * 0.3;
    meshRef.current.rotation.z = t * 0.12 + x * 0.3;
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[-2.2, -0.4, -1.2]} scale={1}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#0891B2"
          emissiveIntensity={0.55}
          metalness={0.6}
          roughness={0.3}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

function FloatingWireSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.1;
    meshRef.current.rotation.x = t * 0.08;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0.4, -3]} scale={2.5}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#6366F1"
          emissiveIntensity={0.35}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#8B5CF6" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#06B6D4" />
      <pointLight position={[0, 4, -3]} intensity={0.8} color="#6366F1" />
      <FloatingTorus />
      <FloatingIcosahedron />
      <FloatingWireSphere />
    </Canvas>
  );
}
