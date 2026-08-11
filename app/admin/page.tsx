"use client";

import { useState } from "react";

export default function AdminPage() {
  const [semester, setSemester] = useState("5");
  const [subject, setSubject] = useState("digital communication");
  const [category, setCategory] = useState("notes");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
    } else {
      setMessage(data.error || "Upload failed");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-2xl p-10">
        <h1 className="mb-8 text-4xl font-bold">
          Upload Resource
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-800 bg-gray-900 p-8"
        >
          <div>
            <label className="mb-2 block">Semester</label>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3"
            >
              <option value="5">Semester 5</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block">Subject</label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3"
            >
              <option value="digital communication">
                Digital Communication
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block">Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3"
            >
              <option value="notes">Notes</option>
              <option value="previous-year-papers">
                Previous Year Papers
              </option>
              <option value="syllabus">Syllabus</option>
              <option value="lab-manual">Lab Manual</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block">Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Unit 1"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">Choose PDF</label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          {message && (
            <p className="text-center text-sm text-green-400">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}