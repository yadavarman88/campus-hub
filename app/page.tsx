"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * app/page.tsx — Home Page
 *
 * TEMPORARY PLACEHOLDERS:
 * SemesterCard, SearchBar, ThemeToggle, and UploadCard are defined inline
 * below because components/ does not exist yet. When components/SemesterCard.tsx,
 * components/SearchBar.tsx, components/ThemeToggle.tsx etc. are generated,
 * these inline versions should be deleted and replaced with imports.
 *
 * DUMMY DATA:
 * Semester and upload data is inlined below because lib/data.ts does not
 * exist yet. Replace with an import from "@/lib/data" once created.
 */

/* ---------- Temporary inline data (replace with lib/data.ts import) ---------- */

const semesters = [
  { id: 1, label: "I", title: "Semester One", subjectCount: 6 },
  { id: 2, label: "II", title: "Semester Two", subjectCount: 6 },
  { id: 3, label: "III", title: "Semester Three", subjectCount: 6 },
  { id: 4, label: "IV", title: "Semester Four", subjectCount: 6 },
  { id: 5, label: "V", title: "Semester Five", subjectCount: 5 },
  { id: 6, label: "VI", title: "Semester Six", subjectCount: 5 },
  { id: 7, label: "VII", title: "Semester Seven", subjectCount: 5 },
  { id: 8, label: "VIII", title: "Semester Eight", subjectCount: 4 },
];

const latestUploads = [
  {
    id: "u1",
    title: "Unit 4 — Two-Port Networks, complete notes",
    subjectCode: "ECE-201",
    subjectName: "Network Analysis",
    type: "Notes",
    uploadedAgo: "2 hours ago",
  },
  {
    id: "u2",
    title: "Mid-semester question paper, 2025",
    subjectCode: "ECE-203",
    subjectName: "Analog Electronics",
    type: "Previous Year Paper",
    uploadedAgo: "5 hours ago",
  },
  {
    id: "u3",
    title: "Updated unit-wise syllabus, 2026 batch",
    subjectCode: "ECE-205",
    subjectName: "Signals & Systems",
    type: "Syllabus",
    uploadedAgo: "1 day ago",
  },
  {
    id: "u4",
    title: "Experiment 6 — Flip-Flops & Counters",
    subjectCode: "ECE-207",
    subjectName: "Digital Electronics",
    type: "Lab Manual",
    uploadedAgo: "1 day ago",
  },
  {
    id: "u5",
    title: "Unit 2 — Interfacing, revised notes",
    subjectCode: "ECE-251",
    subjectName: "MPMC",
    type: "Notes",
    uploadedAgo: "2 days ago",
  },
  {
    id: "u6",
    title: "End-semester paper with solutions, 2024",
    subjectCode: "ECE-253",
    subjectName: "EMFT",
    type: "Previous Year Paper",
    uploadedAgo: "3 days ago",
  },
];

/* ---------- Temporary placeholder components (replace with components/*) ---------- */

function ThemeTogglePlaceholder() {
  const [isDark, setIsDark] = useState(false);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

function SearchBarPlaceholder() {
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

function SemesterCardPlaceholder({
  semester,
}: {
  semester: (typeof semesters)[number];
}) {
  return (
    <Link
      href={`/semester/${semester.id}`}
      className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div>
        <span className="text-xs font-medium tracking-widest text-gray-400">
          SEM {semester.label}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {semester.title}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          {semester.subjectCount} subjects
        </p>
      </div>
      <div className="mt-8 text-sm font-medium text-gray-600 dark:text-gray-300">
        View subjects →
      </div>
    </Link>
  );
}

function UploadCardPlaceholder({
  upload,
}: {
  upload: (typeof latestUploads)[number];
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {upload.type}
        </span>
        <span className="text-[11px] text-gray-400">{upload.uploadedAgo}</span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        {upload.title}
      </h3>
      <p className="mt-3 font-mono text-xs text-gray-400">
        {upload.subjectCode} · {upload.subjectName}
      </p>
    </div>
  );
}

/* ---------- Page ---------- */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header — replace with components/Header.tsx once created */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-gray-50/85 backdrop-blur dark:border-gray-800 dark:bg-gray-950/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-sm font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
              C
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Campus Hub
            </span>
          </Link>
          <ThemeTogglePlaceholder />
        </div>
      </header>

      {/* Hero — replace with components/Hero.tsx once created */}
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
            <SearchBarPlaceholder />
          </div>
        </div>
      </section>

      {/* Semester grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium tracking-widest text-gray-400">
          BROWSE BY SEMESTER
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Pick up where your syllabus does
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {semesters.map((semester) => (
            <SemesterCardPlaceholder key={semester.id} semester={semester} />
          ))}
        </div>
      </section>

      {/* Latest uploads */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium tracking-widest text-gray-400">
          RECENTLY ADDED
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Recently Added
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestUploads.map((upload) => (
            <UploadCardPlaceholder key={upload.id} upload={upload} />
          ))}
        </div>
      </section>

      {/* Footer — replace with components/Footer.tsx once created */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Campus Hub
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Semester-wise notes and resources, organised properly.
          </p>
        </div>
      </footer>
    </main>
  );
}