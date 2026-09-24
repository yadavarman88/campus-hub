import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExploreCard from "@/components/ExploreCard";
import { getBranchBySlug, getSectionsByBranch } from "@/lib/academic-data";

export default async function ExploreBranchPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;

  const branch = getBranchBySlug(branchId);

  if (!branch) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Branch not found
        </h1>
      </main>
    );
  }

  const branchSections = getSectionsByBranch(branch.id);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-medium tracking-widest text-gray-400">
          {branch.code.toUpperCase()} — SECTION
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {branch.name}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose your section to see Semester {5} resources.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branchSections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No sections are available for this branch yet.
              </p>
            </div>
          ) : (
            branchSections.map((section) => (
              <ExploreCard
                key={section.id}
                href={`/explore/${branch.slug}/${section.slug}`}
                eyebrow={branch.code}
                title={section.name}
                subtitle="Choose a semester to continue."
              />
            ))
          )}
        </div>

        <Link
          href="/explore"
          className="mt-8 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back to branches
        </Link>
      </section>

      <Footer />
    </main>
  );
}