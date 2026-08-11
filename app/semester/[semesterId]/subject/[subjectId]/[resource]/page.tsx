import ResourceCard from "@/components/ResourceCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { semesters } from "@/lib/data";
import { subjects } from "@/lib/subjects";
import { getResources } from "@/lib/database";

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

  const files = await getResources(
    semesterNumber,
    subject.name,
    resource
  );

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

        {files.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No resources available.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <ResourceCard
                key={file.id}
                title={file.title}
                type={resourceTitle}
                file={file.file_url}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}