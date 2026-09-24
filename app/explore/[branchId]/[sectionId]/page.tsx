import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExploreCard from "@/components/ExploreCard";
import {
  getBranchBySlug,
  getSectionBySlug,
  getActiveSemestersForBranch,
} from "@/lib/academic-data";

export default async function ExploreSectionPage({
  params,
}: {
  params: Promise<{ branchId: string; sectionId: string }>;
}) {
  const { branchId, sectionId } = await params;

  const branch = getBranchBySlug(branchId);
  const section = getSectionBySlug(sectionId);

  if (!branch || !section || section.branchId !== branch.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Section not found
        </h1>
      </main>
    );
  }

  const activeSemesters = getActiveSemestersForBranch(branch.id);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-medium tracking-widest text-gray-400">
          {branch.code.toUpperCase()} — {section.name.toUpperCase()}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {branch.name} · {section.name}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose a semester to open its subjects.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeSemesters.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No semesters are available for this section yet. Check back
                soon.
              </p>
            </div>
          ) : (
            activeSemesters.map((semester) => (
              <ExploreCard
                key={semester}
                href={`/explore/${branch.slug}/${section.slug}/${semester}`}
                eyebrow="Semester"
                title={`Semester ${semester}`}
                subtitle="Choose a subject to open its resources."
              />
            ))
          )}
        </div>

        <Link
          href={`/explore/${branch.slug}`}
          className="mt-8 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back to {branch.name}
        </Link>
      </section>

      <Footer />
    </main>
  );
}