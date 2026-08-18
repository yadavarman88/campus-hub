"use client";

import { useState } from "react";

export default function UploadForm() {
  const [semester, setSemester] = useState("5");
  const [subject, setSubject] = useState("digital communication");
  const [category, setCategory] = useState("notes");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    } else {
      setMessage(data.error || "Upload failed");
    }

    setLoading(false);
  }

  return (
    <section className="mt-10 rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
      <h2 className="text-3xl font-bold text-white">
        Upload Resource
      </h2>

      <p className="mt-2 text-gray-400">
        Upload notes, previous year papers, syllabus and lab manuals.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Semester
          </label>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white"
          >
            <option value="5">
              Semester 5
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Subject
          </label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white"
          >
            <option value="digital communication">
              Digital Communication
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white"
          >
            <option value="notes">
              Notes
            </option>

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
          <label className="mb-2 block text-sm text-gray-400">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resource title"
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white placeholder-gray-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            PDF File
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className={`text-center ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </form>
    </section>
  );
}