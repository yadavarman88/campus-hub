import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-gray-50/85 backdrop-blur dark:border-gray-800 dark:bg-gray-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-sm font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
            C
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Campus Hub
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
