import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { semesters } from "@/lib/data";
import { getSubjectsBySemester } from "@/lib/subjects";

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ semesterId: string }>;
}) {
  const { semesterId } = await params;

  const semesterNumber = Number(semesterId);
  const semester = semesters.find((s) => s.id === semesterNumber);

  if (!semester) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Semester not found
        </h1>
      </main>
    );
  }

  const semesterSubjects = getSubjectsBySemester(semesterNumber);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Semester {semester.label}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {semester.title}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {semesterSubjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/semester/${semester.id}/subject/${subject.id}`}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <p className="text-xs font-medium tracking-widest text-gray-400">
                {subject.code}
              </p>

              <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {subject.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}