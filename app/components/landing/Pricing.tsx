"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className="h-4 w-4 shrink-0 text-cyan-400"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const freeFeatures = [
    "3 generations / month",
    "CV tailoring",
    "Cover letter mode",
    "Profile storage",
  ];
  const proFeatures = [
    "50 generations / month",
    "Everything in Free",
    "DOCX export (coming soon)",
    "Priority processing",
  ];
  const proPlusFeatures = [
    "200 generations / month",
    "Everything in Pro",
    "For recruiters & coaches",
    "Dedicated support",
  ];

  return (
    <section id="pricing" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            whileHover={{ scale: 1.015 }}
            className="glass-card flex flex-col rounded-3xl p-8"
          >
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/60">
                Free
              </h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-white">€0</span>
                <span className="text-sm text-white/45">/ month</span>
              </p>
              <p className="mt-3 text-sm text-white/55">
                Get a feel for it. Tailor a few CVs every month, no card required.
              </p>
            </div>

            <ul className="mt-7 space-y-3.5 text-sm text-white/80">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.07]"
            >
              Get started free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.18 }}
            whileHover={{ scale: 1.025 }}
            className="gradient-border flex flex-col p-8 shadow-[0_0_60px_-15px_rgba(139,92,246,0.35)] md:scale-[1.03]"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/60">
                Pro
              </h3>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                Most popular
              </span>
            </div>

            <p className="mt-4 flex items-baseline gap-1">
              <span className="gradient-text text-5xl font-bold tracking-tight">€9.99</span>
              <span className="text-sm text-white/45">/ month</span>
            </p>
            <p className="mt-3 text-sm text-white/55">
              For active job seekers tailoring CVs every week.
            </p>

            <ul className="mt-7 space-y-3.5 text-sm text-white/85">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="btn-gradient mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold text-white"
            >
              Go Pro
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          {/* Pro+ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.26 }}
            whileHover={{ scale: 1.015 }}
            className="gradient-border flex flex-col p-8"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wider text-white/60">
                Pro+
              </h3>
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                Power user
              </span>
            </div>

            <p className="mt-4 flex items-baseline gap-1">
              <span className="gradient-text text-5xl font-bold tracking-tight">€24.99</span>
              <span className="text-sm text-white/45">/ month</span>
            </p>
            <p className="mt-3 text-sm text-white/55">
              For recruiters &amp; coaches managing many candidates.
            </p>

            <ul className="mt-7 space-y-3.5 text-sm text-white/85">
              {proPlusFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="btn-gradient mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold text-white"
            >
              Go Pro+
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
