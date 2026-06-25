"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon } from "@/components/ui/icons";

export function Nav() {
  const { isDark, toggle } = useTheme();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(auth.isAuthenticated());
  }, []);

  return (
    <header className="bg-surface-raised border-b border-neutral-border transition-colors duration-200">
      <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-medium text-heading text-base transition-colors duration-150 hover:text-primary-600"
        >
          WorkLife AI
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-heading hover:bg-surface transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {authed ? (
            <Link
              href="/profile"
              className="px-3 py-2 rounded-md text-body hover:text-heading hover:bg-surface transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-primary-600 hover:text-primary-800 dark:hover:text-primary-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-800 dark:hover:bg-primary-400 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
