"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-white/[0.07] bg-[rgba(15,15,26,0.6)] px-5 py-2.5 backdrop-blur-xl sm:mx-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_0_20px_-4px_rgba(139,92,246,0.7)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <span className="hidden sm:inline">CV Customizer</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white/65 md:flex">
          <Link href="#how-it-works" className="transition-colors hover:text-white">How it works</Link>
          <Link href="#features" className="transition-colors hover:text-white">Features</Link>
          <Link href="#pricing" className="transition-colors hover:text-white">Pricing</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden rounded-full px-3 py-1.5 text-sm text-white/75 transition-colors hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="btn-gradient inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
