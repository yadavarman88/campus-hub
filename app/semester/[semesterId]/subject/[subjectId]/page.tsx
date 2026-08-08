import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { semesters } from "@/lib/data";
import { subjects } from "@/lib/subjects";

const resources = [
  { slug: "syllabus", label: "Syllabus" },
  { slug: "notes", label: "Notes" },
  { slug: "previous-year-papers", label: "Previous Year Papers" },
  { slug: "important-questions", label: "Important Questions" },
  { slug: "important-topics", label: "Important Topics" },
  { slug: "lab-manual", label: "Lab Manual" },
];

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ semesterId: string; subjectId: string }>;
}) {
  const { semesterId, subjectId } = await params;
  console.log("semesterId:", semesterId);
console.log("subjectId:", subjectId);
  console.log("semesterId:", semesterId);
    console.log("subjectId:", subjectId);
    console.log("subjects:", subjects);

  const semesterNumber = Number(semesterId);

  const semester = semesters.find((s) => s.id === semesterNumber);

console.log("All subject IDs:");
subjects.forEach((s) => {
  console.log(s.id, s.semesterId);
});

const subject = subjects.find(
  (s) => s.id === subjectId && s.semesterId === semesterNumber
);

console.log("Found subject:", subject);

  if (!semester || !subject) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Subject not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-medium tracking-widest text-gray-400">
          {subject.code}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {subject.name}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a resource below.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.slug}
              href={`/semester/${semesterId}/subject/${subjectId}/${resource.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {resource.label}
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Open {resource.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}