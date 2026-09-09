"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function emptySubscribe() {
  return () => {};
}

function readInitialTheme(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const stored = localStorage.getItem("theme");

  return stored
    ? stored === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isDark, setIsDark] = useState(readInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}