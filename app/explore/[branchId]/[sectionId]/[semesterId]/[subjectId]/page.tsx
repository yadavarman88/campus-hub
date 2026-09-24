import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExploreCard from "@/components/ExploreCard";
import {
  getBranchBySlug,
  getSectionBySlug,
  isActiveSemester,
  getSubjectBySemesterAndId,
  subjectLabel,
} from "@/lib/academic-data";

const resourceCategories = [
  { slug: "syllabus", label: "Syllabus" },
  { slug: "notes", label: "Notes" },
  { slug: "previous-year-papers", label: "Previous Year Papers" },
  { slug: "important-questions", label: "Important Questions" },
  { slug: "important-topics", label: "Important Topics" },
  { slug: "lab-manual", label: "Lab Manual" },
];

export default async function ExploreSubjectPage({
  params,
}: {
  params: Promise<{
    branchId: string;
    sectionId: string;
    semesterId: string;
    subjectId: string;
  }>;
}) {
  const { branchId, sectionId, semesterId, subjectId } = await params;

  const branch = getBranchBySlug(branchId);
  const section = getSectionBySlug(sectionId);
  const semesterNumber = Number(semesterId);
  const semesterIsValid =
    Number.isInteger(semesterNumber) && isActiveSemester(semesterNumber);
  const subject = semesterIsValid
    ? getSubjectBySemesterAndId(semesterNumber, subjectId)
    : undefined;

  if (!branch || !section || section.branchId !== branch.id || !subject) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
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
          {branch.code.toUpperCase()} · {section.name.toUpperCase()} ·
          SEMESTER {semesterNumber} · {subject.code}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {subjectLabel(subject)}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a resource below.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resourceCategories.map((category) => (
            <ExploreCard
              key={category.slug}
              href={`/explore/${branch.slug}/${section.slug}/${semesterNumber}/${subject.id}/${category.slug}`}
              eyebrow={subject.code}
              title={category.label}
              subtitle={`Open ${category.label} files.`}
            />
          ))}
        </div>

        <Link
          href={`/explore/${branch.slug}/${section.slug}/${semesterNumber}`}
          className="mt-8 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back to Subjects
        </Link>
      </section>

      <Footer />
    </main>
  );
}