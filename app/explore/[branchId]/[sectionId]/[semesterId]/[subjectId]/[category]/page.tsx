import Link from "next/link";
import ResourceCard from "@/components/ResourceCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getBranchBySlug,
  getSectionBySlug,
  isActiveSemester,
  getSubjectBySemesterAndId,
  subjectLabel,
} from "@/lib/academic-data";
import { getResourcesForExplore } from "@/lib/database";

const validCategories = new Set([
  "syllabus",
  "notes",
  "previous-year-papers",
  "important-questions",
  "important-topics",
  "lab-manual",
]);

export default async function ExploreCategoryPage({
  params,
}: {
  params: Promise<{
    branchId: string;
    sectionId: string;
    semesterId: string;
    subjectId: string;
    category: string;
  }>;
}) {
  const { branchId, sectionId, semesterId, subjectId, category } =
    await params;

  const branch = getBranchBySlug(branchId);
  const section = getSectionBySlug(sectionId);
  const semesterNumber = Number(semesterId);
  const semesterIsValid =
    Number.isInteger(semesterNumber) && isActiveSemester(semesterNumber);
  const subject = semesterIsValid
    ? getSubjectBySemesterAndId(semesterNumber, subjectId)
    : undefined;

  if (
    !branch ||
    !section ||
    section.branchId !== branch.id ||
    !subject ||
    !validCategories.has(category)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Category not found
        </h1>
      </main>
    );
  }

  const files = await getResourcesForExplore(
    semesterNumber,
    subject.id,
    section.id,
    category
  );

  const resourceTitle = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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

        <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">
          {resourceTitle}
        </p>

        {files.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No resources available yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <ResourceCard
                key={file.id}
                title={file.title}
                type={resourceTitle}
                file={file.file_url}
              />
            ))}
          </div>
        )}

        <Link
          href={`/explore/${branch.slug}/${section.slug}/${semesterNumber}/${subject.id}`}
          className="mt-8 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back to {subjectLabel(subject)}
        </Link>
      </section>

      <Footer />
    </main>
  );
}