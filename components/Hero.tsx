import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium tracking-wide text-gray-600 dark:border-gray-700 dark:text-gray-400">
            Built for IPU students
          </span>

          <h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Everything your semester needs.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Notes, previous year papers, syllabus, lab manuals and important
            questions — organised semester-wise so you can find what you need
            in seconds.
          </p>

          <div className="mt-10 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>8 Semesters</span>
            <span>•</span>
            <span>50+ Subjects</span>
            <span>•</span>
            <span>Notes & PYQs</span>
          </div>
        </div>
      </div>
    </section>
  );
}