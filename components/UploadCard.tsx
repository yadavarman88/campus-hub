export interface Upload {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  type: string;
  uploadedAgo: string;
}

export default function UploadCard({ upload }: { upload: Upload }) {
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
