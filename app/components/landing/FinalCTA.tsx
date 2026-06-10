"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      {/* Indigo bloom */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.18) 35%, rgba(5,5,15,0) 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(5,5,15,0) 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Ready to <span className="gradient-text">stand out?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          Join professionals who stopped sending the same CV to every job.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/auth/signup"
            className="btn-gradient inline-flex items-center justify-center gap-1.5 rounded-full px-8 py-4 text-base font-semibold text-white"
          >
            Start for free
            <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-white/40">No credit card required</p>
        </div>
      </motion.div>
    </section>
  );
}
