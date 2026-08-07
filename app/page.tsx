import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SemesterCard, { Semester } from "@/components/SemesterCard";
import UploadCard, { Upload } from "@/components/UploadCard";

const semesters: Semester[] = [
  { id: 1, label: "I", title: "Semester One", subjectCount: 6 },
  { id: 2, label: "II", title: "Semester Two", subjectCount: 6 },
  { id: 3, label: "III", title: "Semester Three", subjectCount: 6 },
  { id: 4, label: "IV", title: "Semester Four", subjectCount: 6 },
  { id: 5, label: "V", title: "Semester Five", subjectCount: 5 },
  { id: 6, label: "VI", title: "Semester Six", subjectCount: 5 },
  { id: 7, label: "VII", title: "Semester Seven", subjectCount: 5 },
  { id: 8, label: "VIII", title: "Semester Eight", subjectCount: 4 },
];

const latestUploads: Upload[] = [
  { id: "u1", title: "Unit 4 — Two-Port Networks, complete notes", subjectCode: "ECE-201", subjectName: "Network Analysis", type: "Notes", uploadedAgo: "2 hours ago" },
  { id: "u2", title: "Mid-semester question paper, 2025", subjectCode: "ECE-203", subjectName: "Analog Electronics", type: "Previous Year Paper", uploadedAgo: "5 hours ago" },
  { id: "u3", title: "Updated unit-wise syllabus, 2026 batch", subjectCode: "ECE-205", subjectName: "Signals & Systems", type: "Syllabus", uploadedAgo: "1 day ago" },
  { id: "u4", title: "Experiment 6 — Flip-Flops & Counters", subjectCode: "ECE-207", subjectName: "Digital Electronics", type: "Lab Manual", uploadedAgo: "1 day ago" },
  { id: "u5", title: "Unit 2 — Interfacing, revised notes", subjectCode: "ECE-251", subjectName: "MPMC", type: "Notes", uploadedAgo: "2 days ago" },
  { id: "u6", title: "End-semester paper with solutions, 2024", subjectCode: "ECE-253", subjectName: "EMFT", type: "Previous Year Paper", uploadedAgo: "3 days ago" },
];

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