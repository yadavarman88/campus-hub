import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExploreCard from "@/components/ExploreCard";
import { getBranches } from "@/lib/academic-data";

export default function ExplorePage() {
  const branches = getBranches();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-medium tracking-widest text-gray-400">
          EXPLORE RESOURCES
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Choose your branch
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse academic resources organised by branch, section, and
          semester.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No branches are available yet.
              </p>
            </div>
          ) : (
            branches.map((branch) => (
              <ExploreCard
                key={branch.id}
                href={`/explore/${branch.slug}`}
                eyebrow={branch.code}
                title={branch.name}
                subtitle="Choose a section to continue."
              />
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}