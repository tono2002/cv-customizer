"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "../SignOutButton";

type AppNavProps = {
  userEmail: string | null;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const HomeIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const SparkleIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const navItems: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: HomeIcon },
  { href: "/app/generate", label: "New Generation", icon: SparkleIcon },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ userEmail }: AppNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: "64px",
        backgroundColor: "rgba(5,5,15,0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-base sm:text-lg font-bold gradient-text">CV Customizer</span>
        </Link>

        {/* Center: Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(pathname ?? "", item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                <span className={active ? "text-indigo-300" : "text-white/40"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: User + Sign out */}
        <div className="flex items-center gap-2.5 shrink-0">
          {userEmail && (
            <span className="hidden sm:block text-xs text-white/40 max-w-[160px] truncate">
              {userEmail}
            </span>
          )}
          <div className="hidden md:block">
            <SignOutButton />
          </div>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-white/70 hover:text-white border border-white/10 rounded-lg p-1.5 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 px-4 py-3 flex flex-col gap-1"
          style={{
            backgroundColor: "rgba(5,5,15,0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {navItems.map((item) => {
            const active = isActive(pathname ?? "", item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                <span className={active ? "text-indigo-300" : "text-white/40"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            {userEmail && (
              <span className="text-xs text-white/40 truncate">{userEmail}</span>
            )}
            <SignOutButton />
          </div>
        </div>
      )}
    </nav>
  );
}
