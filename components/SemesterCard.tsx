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
      className="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      <div>
        <h3 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {semester.title}
        </h3>

        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          {semester.subjectCount} Subjects
        </p>
      </div>

      <div className="mt-10 flex items-center text-sm font-medium text-gray-600 transition-all group-hover:translate-x-1 dark:text-gray-300">
        View subjects
        <span className="ml-2">→</span>
      </div>
    </Link>
  );
}