import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SemesterCard from "@/components/SemesterCard";
import AnnouncementFeed from "@/components/student/AnnouncementFeed";
import ImportantQuestionsBrowser from "@/components/student/ImportantQuestionsBrowser";
import { semesters } from "@/lib/data";

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
                Explore Semesters
              </h2>
            </div>

            <p className="ml-4 text-sm leading-6 text-gray-500">
              Browse subjects and resources by semester.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {semesters.map((semester) => (
              <SemesterCard key={semester.id} semester={semester} />
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}