"use client";

export default function SearchBar() {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <span className="text-gray-400">🔍</span>
      <input
        type="text"
        placeholder="Search notes, PYQs, syllabus..."
        className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
      >
        Search
      </button>
    </form>
  );
}
