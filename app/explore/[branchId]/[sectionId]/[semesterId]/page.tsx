import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExploreCard from "@/components/ExploreCard";
import {
  getBranchBySlug,
  getSectionBySlug,
  isActiveSemester,
  getSubjectsByBranchSemester,
  subjectLabel,
} from "@/lib/academic-data";

export default async function ExploreSemesterPage({
  params,
}: {
  params: Promise<{
    branchId: string;
    sectionId: string;
    semesterId: string;
  }>;
}) {
  const { branchId, sectionId, semesterId } = await params;

  const branch = getBranchBySlug(branchId);
  const section = getSectionBySlug(sectionId);
  const semesterNumber = Number(semesterId);

  if (
    !branch ||
    !section ||
    section.branchId !== branch.id ||
    !Number.isInteger(semesterNumber) ||
    !isActiveSemester(semesterNumber)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Semester not found
        </h1>
      </main>
    );
  }

  const semesterSubjects = getSubjectsByBranchSemester(
    branch.id,
    semesterNumber
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-medium tracking-widest text-gray-400">
          {branch.code.toUpperCase()} · {section.name.toUpperCase()} ·
          SEMESTER {semesterNumber}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Semester {semesterNumber} — Subjects
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a subject below to open its resources.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {semesterSubjects.map((subject) => (
            <ExploreCard
              key={subject.id}
              href={`/explore/${branch.slug}/${section.slug}/${semesterNumber}/${subject.id}`}
              eyebrow={subject.code}
              title={subjectLabel(subject)}
              subtitle="Choose a resource category to continue."
            />
          ))}
        </div>

        <Link
          href={`/explore/${branch.slug}/${section.slug}`}
          className="mt-8 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back to Semesters
        </Link>
      </section>

      <Footer />
    </main>
  );
}