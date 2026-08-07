import Link from "next/link";

export interface Semester {
  id: number;
  label: string;
  title: string;
  subjectCount: number;
}

export default function SemesterCard({ semester }: { semester: Semester }) {
  return (
    <Link
      href={`/semester/${semester.id}`}
      className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div>
        <span className="text-xs font-medium tracking-widest text-gray-400">
          SEM {semester.label}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {semester.title}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          {semester.subjectCount} subjects
        </p>
      </div>
      <div className="mt-8 text-sm font-medium text-gray-600 dark:text-gray-300">
        View subjects →
      </div>
    </Link>
  );
}
