import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { semesters } from "@/lib/data";
import { subjects } from "@/lib/subjects";

const dummyItems = [
  { title: "Unit 1", type: "PDF" },
  { title: "Unit 2", type: "PDF" },
  { title: "Unit 3", type: "PDF" },
  { title: "Unit 4", type: "PDF" },
  { title: "Complete Notes", type: "PDF" },
];

export default async function ResourcePage({
  params,
}: {
  params: Promise<{
    semesterId: string;
    subjectId: string;
    resource: string;
  }>;
}) {
  const { semesterId, subjectId, resource } = await params;

  const semesterNumber = Number(semesterId);

  const semester = semesters.find((s) => s.id === semesterNumber);

  const subject = subjects.find(
    (s) => s.id === subjectId && s.semesterId === semesterNumber
  );

  if (!semester || !subject) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Resource not found
        </h1>
      </main>
    );
  }

  const resourceTitle = resource
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-xs font-medium tracking-widest text-gray-400">
          {subject.code}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {subject.name}
        </h1>

        <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">
          {resourceTitle}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dummyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {item.type}
                </span>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}