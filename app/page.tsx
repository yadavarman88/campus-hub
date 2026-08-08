import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

import SemesterCard from "@/components/SemesterCard";
import UploadCard from "@/components/UploadCard";

import { semesters, latestUploads } from "@/lib/data";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium tracking-widest text-gray-400">BROWSE BY SEMESTER</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Pick up where your syllabus does</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {semesters.map((semester) => (
            <SemesterCard key={semester.id} semester={semester} />
          ))}
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