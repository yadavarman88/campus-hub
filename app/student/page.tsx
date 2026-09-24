import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnnouncementFeed from "@/components/student/AnnouncementFeed";
import ImportantQuestionsBrowser from "@/components/student/ImportantQuestionsBrowser";

export default function StudentPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      {/* Ambient orange lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-180px] top-[180px] h-[420px] w-[420px] rounded-full bg-orange-500/[0.10] blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-160px] top-[520px] h-[500px] w-[500px] rounded-full bg-orange-600/[0.07] blur-[160px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-220px] left-[35%] h-[420px] w-[420px] rounded-full bg-orange-400/[0.05] blur-[150px]"
      />

      <Header />

      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-orange-400/15 bg-white/[0.035] px-7 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-32 h-72 w-72 rounded-full bg-orange-500/[0.12] blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-[-100px] left-[30%] h-56 w-56 rounded-full bg-orange-400/[0.06] blur-[90px]"
          />

          <div className="relative max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
                Student Dashboard
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="text-orange-400">Campus Hub</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              Your academic resources, announcements, and exam preparation
              materials — organised in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-orange-400/20 bg-orange-500/[0.08] px-4 py-2 text-xs font-medium text-orange-300 backdrop-blur-xl">
                Semester Resources
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-gray-400 backdrop-blur-xl">
                Faculty Announcements
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-gray-400 backdrop-blur-xl">
                Important Questions
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <section className="mt-16">
          <div className="mb-7 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-orange-500" />

              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Announcements
              </h2>
            </div>

            <p className="ml-4 text-sm leading-6 text-gray-500">
              Updates relevant to your semester and subjects.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
            <AnnouncementFeed />
          </div>
        </section>

        {/* Important Questions */}
        <section className="mt-16">
          <div className="mb-7 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-orange-500" />

              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Important Questions
              </h2>
            </div>

            <p className="ml-4 text-sm leading-6 text-gray-500">
              Browse and download important questions prepared for your
              semester.
            </p>
          </div>

          <div className="rounded-[2rem] border border-orange-400/10 bg-white/[0.025] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-6">
            <ImportantQuestionsBrowser />
          </div>
        </section>

        {/* Semesters */}
        <section className="mt-16">
          <div className="mb-7 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-orange-500" />

              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Explore Resources
              </h2>
            </div>

            <p className="ml-4 text-sm leading-6 text-gray-500">
              Browse subjects and resources by branch, section, and semester.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/explore"
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-orange-400/15 bg-white/[0.035] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-orange-500/[0.05] hover:shadow-[0_20px_60px_rgba(249,115,22,0.12)]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/[0.10] blur-[70px] transition-opacity duration-300 group-hover:bg-orange-500/[0.18]"
              />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400/80">
                    ECE
                  </span>

                  <span className="text-xs font-medium text-gray-600 transition-colors duration-300 group-hover:text-orange-400">
                    Semester 5
                  </span>
                </div>

                <h3 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white transition-colors duration-300 group-hover:text-orange-50">
                  Explore
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Find notes, PYQs, syllabus and lab manuals for your section.
                </p>
              </div>

              <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
                <span className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
                  Start exploring
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-400 transition-all duration-300 group-hover:border-orange-400/30 group-hover:bg-orange-500/10 group-hover:text-orange-400">
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
      </section>

      <Footer />
    </main>
  );
}