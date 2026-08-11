"use client";

import { useEffect, useState } from "react";

type Resource = {
  id: string;
  title: string;
  semester: number;
  subject: string;
  category: string;
  file_url: string;
  created_at: string;
};

export default function AdminPage() {
  const [semester, setSemester] = useState("5");
  const [subject, setSubject] = useState("digital communication");
  const [category, setCategory] = useState("notes");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadResources() {
    const res = await fetch("/api/resources");
    const data = await res.json();
    setResources(data);
  }

  useEffect(() => {
    loadResources();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!file) {
      setMessage("Please choose a PDF.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();

    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Upload successful!");

      setTitle("");
      setFile(null);

      await loadResources();
    } else {
      setMessage(data.error || "Upload failed");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-8 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Campus Hub Admin
          </h1>

          <p className="mt-2 text-gray-500">
            Manage resources across all semesters.
          </p>
        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Resources
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {resources.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Subjects
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              1
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Semesters
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              8
            </h2>
          </div>

        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8">

          <h2 className="mb-8 text-2xl font-semibold">
            Upload Resource
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="mb-2 block text-sm font-medium">
                Semester
              </label>

              <select
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white p-3"
              >
                <option value="5">
                  Semester 5
                </option>
              </select>

            </div>
                        <div>

              <label className="mb-2 block text-sm font-medium">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3"
              >
                <option value="digital communication">
                  Digital Communication
                </option>
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3"
              >
                <option value="notes">Notes</option>
                <option value="previous-year-papers">
                  Previous Year Papers
                </option>
                <option value="syllabus">
                  Syllabus
                </option>
                <option value="lab-manual">
                  Lab Manual
                </option>
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Unit 1"
                className="w-full rounded-xl border border-gray-300 p-3"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                PDF File
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border border-dashed border-gray-300 p-4"
              />

            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Resource"}
            </button>

            {message && (
              <p className="text-center text-sm font-medium text-green-600">
                {message}
              </p>
            )}

          </form>

        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-semibold">
              Recent Resources
            </h2>

            <span className="text-sm text-gray-500">
              {resources.length} Total
            </span>

          </div>
                    {resources.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-500">
                No resources uploaded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-5 transition hover:border-gray-300"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {resource.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Semester {resource.semester} • {resource.subject} •{" "}
                      {resource.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100"
                    >
                      View
                    </a>

                    <button
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </main>
  );
}

