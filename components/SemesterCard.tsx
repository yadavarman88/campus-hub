import Link from "next/link";
import { Semester } from "@/lib/types";

export default function SemesterCard({
  semester,
}: {
  semester: Semester;
}) {
  return (
    <Link
      href={`/semester/${semester.id}`}
      className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-orange-500/[0.05] hover:shadow-[0_20px_60px_rgba(249,115,22,0.12)]"
    >
      {/* Subtle orange hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/[0.10] blur-[70px] transition-opacity duration-300 group-hover:bg-orange-500/[0.18]"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Semester
          </span>

          <span className="text-xs font-medium text-gray-600 transition-colors duration-300 group-hover:text-orange-400">
            {semester.subjectCount} subjects
          </span>
        </div>

        <h3 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-white transition-colors duration-300 group-hover:text-orange-50">
          {semester.label}
        </h3>

        <p className="mt-4 text-sm text-gray-500">
          Explore courses and available resources.
        </p>
      </div>

      <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
        <span className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
          View subjects
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-400 transition-all duration-300 group-hover:border-orange-400/30 group-hover:bg-orange-500/10 group-hover:text-orange-400">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path
              d="M4 10h11M11 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}