import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SemesterCard from "@/components/SemesterCard";
import AnnouncementFeed from "@/components/student/AnnouncementFeed";
import { semesters } from "@/lib/data";

export default function StudentPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium tracking-widest text-gray-400">
          STUDENT DASHBOARD
        </span>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Welcome to Campus Hub
        </h1>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Browse your course resources by semester.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Announcements
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Updates relevant to your semester and subjects.
          </p>

          <div className="mt-6">
            <AnnouncementFeed />
          </div>
        </section>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {semesters.map((semester) => (
            <SemesterCard key={semester.id} semester={semester} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
