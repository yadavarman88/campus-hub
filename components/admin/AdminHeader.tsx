export default function AdminHeader() {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Campus Hub
          </h1>

          <p className="mt-2 text-gray-400">
            Manage notes, PYQs, syllabus and lab manuals.
          </p>
        </div>

        <div className="rounded-full border border-gray-700 bg-[#171A21] px-4 py-2 text-sm text-gray-300">
          Admin
        </div>
      </div>
    </div>
  );
}