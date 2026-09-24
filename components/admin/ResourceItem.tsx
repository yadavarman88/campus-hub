import { getSectionBySlug } from "@/lib/academic-data";

type Resource = {
  id: string;
  title: string;
  semester: number;
  subject: string;
  category: string;
  file_url: string;
  section_id?: string | null;
};

type Props = {
  resource: Resource;
};

export default function ResourceItem({ resource }: Props) {
  const section = resource.section_id
    ? getSectionBySlug(resource.section_id)
    : undefined;

  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-blue-400/10 bg-blue-500/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-blue-500/[0.07] hover:shadow-[0_16px_50px_rgba(37,99,235,0.12)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">
              {resource.title}
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Semester {resource.semester} · {resource.subject} ·{" "}
              {resource.category}
            </p>

            {section && (
              <p className="mt-1 text-xs text-gray-500">
                Section: {section.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-3">
        <a
          href={resource.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-blue-400/20 bg-blue-500/5 px-4 py-2 text-sm font-medium text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/15 hover:text-blue-200"
        >
          View
        </a>

        <button
          type="button"
          onClick={async () => {
            const confirmed = window.confirm(
              "Delete this resource?"
            );

            if (!confirmed) return;

            const res = await fetch("/api/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: resource.id,
              }),
            });

            if (res.ok) {
              window.location.reload();
            } else {
              alert("Failed to delete resource.");
            }
          }}
          className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}