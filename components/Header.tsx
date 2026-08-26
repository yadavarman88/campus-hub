import Link from "next/link";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            C
          </div>

          <div className="flex flex-col">
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Campus Hub
            </span>

            <span className="text-[11px] tracking-wide text-gray-500">
              IPU Resource Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
            <ThemeToggle />
          </div>

          <AuthButton />
        </div>
      </div>
    </header>
  );
}