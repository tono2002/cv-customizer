"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute inset-0 -z-10">
        <div
          className="aurora-blob aurora-blob-1"
          style={{ width: "650px", height: "650px", top: "-180px", left: "-160px" }}
        />
        <div
          className="aurora-blob aurora-blob-2"
          style={{ width: "720px", height: "720px", top: "10%", right: "-220px" }}
        />
        <div
          className="aurora-blob aurora-blob-3"
          style={{ width: "560px", height: "560px", bottom: "-200px", left: "30%" }}
        />
        <div className="landing-grain" />
      </div>

      {/* Three.js canvas — sits behind the content */}
      <div className="absolute inset-0 -z-[5] opacity-80">
        <HeroScene />
      </div>

      {/* Soft vignette to keep text readable */}
      <div
        className="pointer-events-none absolute inset-0 -z-[4]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,15,0) 0%, rgba(5,5,15,0.55) 60%, rgba(5,5,15,0.9) 100%)",
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          AI-powered • No hallucinations
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your CV, tailored to{" "}
          <span className="gradient-text">every job</span> in seconds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          Upload your CV once. Paste any job offer. Get a perfectly tailored PDF
          that mirrors the role&apos;s keywords, without inventing a single
          line of experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/auth/signup"
            className="btn-gradient inline-flex items-center justify-center gap-1.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white sm:text-base"
          >
            Start for free
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.02] px-7 py-3.5 text-sm font-semibold text-white/85 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/[0.06] sm:text-base"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 text-xs text-white/40"
        >
          Join professionals tailoring their CVs with AI
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-white/70"
          />
        </div>
      </motion.div>
    </section>
  );
}
