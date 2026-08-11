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
      className="group flex min-h-[210px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      <div>
        <span className="text-sm font-medium uppercase tracking-[0.18em] text-gray-400">
          Semester
        </span>

        <h3 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {semester.label}
        </h3>

        <p className="mt-6 text-base text-gray-500 dark:text-gray-400">
          {semester.subjectCount} Subjects
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          View subjects
        </span>

        <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}