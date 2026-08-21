import AuthButton from "@/components/AuthButton";

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

        <AuthButton variant="admin" />
      </div>
    </div>
  );
}