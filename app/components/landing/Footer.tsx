import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
        <Link href="/" className="text-sm font-semibold text-white">
          <span className="gradient-text">CV Customizer</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/auth/login"
            className="text-white/55 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-white/55 transition-colors hover:text-white"
          >
            Sign up
          </Link>
        </nav>
      </div>

      <p className="mt-6 text-center text-xs text-white/35">
        © 2026 CV Customizer. Built with Claude AI.
      </p>
    </footer>
  );
}
