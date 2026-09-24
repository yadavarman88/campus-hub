"use client";

import { useState } from "react";
import {
  getActiveSemestersForBranch,
  getBranches,
  getSectionsByBranch,
  getSubjectsByBranchSemester,
  subjectLabel,
  subjectName,
} from "@/lib/academic-data";

export default function UploadForm() {
  const branches = getBranches();

  const [branchId, setBranchId] = useState(
    branches[0]?.slug ?? ""
  );
  const [sectionId, setSectionId] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [category, setCategory] = useState("notes");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const branchSections = branchId
    ? getSectionsByBranch(branchId)
    : [];
  const activeSemesters = branchId
    ? getActiveSemestersForBranch(branchId)
    : [];
  const selectedSubject =
    semester && subjectId
      ? getSubjectsByBranchSemester(branchId, Number(semester)).find(
          (subject) => subject.id === subjectId
        )
      : undefined;

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!file) {
      setMessage("Please choose a PDF.");
      return;
    }

    if (!branchId || !sectionId || !semester || !subjectId) {
      setMessage(
        "Choose a branch, section, semester, and subject before uploading."
      );
      return;
    }

    if (!selectedSubject) {
      setMessage(
        "The selected subject is not available for this semester."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();

    formData.append("branch_id", branchId);
    formData.append("section_id", sectionId);
    formData.append("semester", semester);
    formData.append("subject_id", subjectId);
    formData.append("subject", subjectName(selectedSubject));
    formData.append("category", category);
    formData.append("title", title);
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Upload successful.");
        setTitle("");
        setCategory("notes");
        setFile(null);
      } else {
        setMessage(data.error || "Upload failed.");
      }
    } catch {
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-blue-400/20 focus:border-blue-400/40 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/[0.08]";

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-blue-400/[0.12] bg-gradient-to-br from-blue-500/[0.07] via-white/[0.025] to-transparent p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.8)]" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Resource Library
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Upload Resource
            </h2>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-gray-400">
          Upload notes, previous year papers, syllabus and lab manuals for
          your students.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Branch */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Branch
            </label>

            <select
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setSectionId("");
                setSemester("");
                setSubjectId("");
              }}
              className={inputClass}
            >
              {branches.length === 0 ? (
                <option value="" className="bg-[#0B0F17]">
                  No branches available
                </option>
              ) : (
                branches.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.slug}
                    className="bg-[#0B0F17]"
                  >
                    {branch.code} — {branch.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Section
            </label>

            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={!branchId || branchSections.length === 0}
              className={inputClass}
            >
              <option value="" className="bg-[#0B0F17]">
                Select a section
              </option>

              {branchSections.map((section) => (
                <option
                  key={section.id}
                  value={section.slug}
                  className="bg-[#0B0F17]"
                >
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Semester
            </label>

            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSubjectId("");
              }}
              disabled={!sectionId || activeSemesters.length === 0}
              className={inputClass}
            >
              <option value="" className="bg-[#0B0F17]">
                Select a semester
              </option>

              {activeSemesters.map((semesterNumber) => (
                <option
                  key={semesterNumber}
                  value={semesterNumber}
                  className="bg-[#0B0F17]"
                >
                  Semester {semesterNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Subject
            </label>

            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!semester}
              className={inputClass}
            >
              <option value="" className="bg-[#0B0F17]">
                {semester
                  ? "Select a subject"
                  : "Select a semester first"}
              </option>

              {getSubjectsByBranchSemester(
                branchId,
                Number(semester)
              ).map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                  className="bg-[#0B0F17]"
                >
                  {subjectLabel(subject)}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="notes">Notes</option>
              <option value="previous-year-papers">
                Previous Year Papers
              </option>
              <option value="syllabus">Syllabus</option>
              <option value="lab-manual">Lab Manual</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Resource Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter resource title"
            className={inputClass}
          />
        </div>

        {/* File */}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
            PDF File
          </label>

          <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] p-3 transition hover:border-blue-400/25 hover:bg-blue-500/[0.025]">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-300 file:transition hover:file:bg-blue-500/20"
            />
          </div>

          {file && (
            <p className="mt-2 text-xs text-blue-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.18)] transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_10px_35px_rgba(37,99,235,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-center text-sm ${
              message === "Upload successful."
                ? "border-blue-400/15 bg-blue-500/[0.06] text-blue-300"
                : "border-red-400/15 bg-red-500/[0.06] text-red-400"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </section>
  );
}