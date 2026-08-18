type Resource = {
  id: string;
  title: string;
  semester: number;
  subject: string;
  category: string;
  file_url: string;
};

type Props = {
  resource: Resource;
};

export default function ResourceItem({
  resource,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-5 transition hover:border-gray-500">
      <div>
        <h3 className="text-lg font-semibold text-white">
          {resource.title}
        </h3>

        <p className="mt-1 text-sm text-gray-400">
          Semester {resource.semester} • {resource.subject} •{" "}
          {resource.category}
        </p>
      </div>

      <div className="flex gap-3">

        <a
          href={resource.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-800"
        >
          View
        </a>

        <button
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
  className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
>
  Delete
</button>

      </div>
    </div>
  );
}