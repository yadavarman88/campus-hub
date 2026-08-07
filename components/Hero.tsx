import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          8 semesters, organised end to end
        </span>

        <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          All your semester notes, PYQs and syllabus in one place.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          No more searching through WhatsApp groups. Find every academic
          resource organised semester-wise.
        </p>

        <div className="mt-8 max-w-xl">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
