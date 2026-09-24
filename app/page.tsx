import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

import UploadCard from "@/components/UploadCard";

import { latestUploads } from "@/lib/data";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium tracking-widest text-gray-400">EXPLORE RESOURCES</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Browse by branch, section and semester</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/explore"
            className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500/80">
                ECE
              </span>
              <h3 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-gray-50">
                Explore
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Find notes, PYQs, syllabus and lab manuals for your section and
                semester.
              </p>
            </div>
            <div className="relative mt-8 flex items-center justify-between border-t border-gray-200 pt-5 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-orange-500">
                Start exploring
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-orange-400/40 group-hover:bg-orange-500/10 group-hover:text-orange-500 dark:border-gray-700">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path
                    d="M4 10h11M11 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium tracking-widest text-gray-400">RECENTLY ADDED</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Recently Added</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestUploads.map((upload) => (
            <UploadCard key={upload.id} upload={upload} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}