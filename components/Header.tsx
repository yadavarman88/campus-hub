import Link from "next/link";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-base font-bold text-white dark:bg-white dark:text-gray-900">
            C
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Campus Hub
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              IPU Resource Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}