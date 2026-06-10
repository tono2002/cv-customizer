"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  const x = useSpring(rawX, { stiffness: 70, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.4 });

  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!glowRef.current) return;
      glowRef.current.style.background = `radial-gradient(700px circle at ${x.get()}px ${y.get()}px, rgba(139,92,246,0.13) 0%, rgba(99,102,241,0.06) 35%, transparent 65%)`;
    };

    const unsubX = x.on("change", update);
    const unsubY = y.on("change", update);

    const onMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      unsubX();
      unsubY();
    };
  }, [rawX, rawY, x, y]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
