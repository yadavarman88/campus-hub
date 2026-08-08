interface ResourceCardProps {
  title: string;
  type: string;
  file: string;
  uploadedBy?: string;
  uploadedOn?: string;
  fileSize?: string;
}

export default function ResourceCard({
  title,
  type,
  file,
  uploadedBy = "Campus Hub",
  uploadedOn = "Today",
  fileSize = "2.3 MB",
}: ResourceCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {type}
          </span>
        </div>
      </div>

      {/* Information */}
      <div className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <span className="font-medium">📦 Size:</span> {fileSize}
        </p>

        <p>
          <span className="font-medium">📅 Uploaded:</span> {uploadedOn}
        </p>

        <p>
          <span className="font-medium">👤 By:</span> {uploadedBy}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-black"
        >
          👁 View
        </a>

        <a
          href={file}
          download
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          ⬇ Download
        </a>
      </div>
    </div>
  );
}