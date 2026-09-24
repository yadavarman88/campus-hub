"use client";

import { useState } from "react";
import { getSubjectsBySemester } from "@/lib/subjects";
import {
  getBranches,
  getSectionsByBranch,
  subjectLabel,
} from "@/lib/academic-data";

type FormMessage = {
  type: "success" | "error";
  text: string;
};

type Props = {
  onCreated?: () => void;
};

function getApiError(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return fallback;
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M12 16V4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m7.5 8.5 4.5-4.5 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15.5v3.25c0 .69.56 1.25 1.25 1.25h11.5c.69 0 1.25-.56 1.25-1.25V15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ImportantQuestionsForm({ onCreated }: Props) {
  const branches = getBranches();

  const [title, setTitle] = useState("");
  const [branchId, setBranchId] = useState(branches[0]?.slug ?? "");
  const [sectionId, setSectionId] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const branchSections = branchId ? getSectionsByBranch(branchId) : [];

  const availableSubjects = semester
    ? getSubjectsBySemester(Number(semester))
    : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 1 || trimmedTitle.length > 160) {
      setMessage({
        type: "error",
        text: "Title must be between 1 and 160 characters.",
      });
      return;
    }

    if (
      !branchId ||
      !sectionId ||
      !semester ||
      !subjectId ||
      !unitNumber ||
      !file
    ) {
      setMessage({
        type: "error",
        text: "Choose a branch, section, semester, subject, unit, and file before uploading.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", trimmedTitle);
    formData.append("branch_id", branchId);
    formData.append("section_id", sectionId);
    formData.append("semester", semester);
    formData.append("subject_id", subjectId);
    formData.append("unit_number", unitNumber);
    formData.append("file", file);

    try {
      const response = await fetch("/api/teacher/important-questions", {
        method: "POST",
        body: formData,
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiError(data, "Unable to upload the important question.")
        );
      }

      setTitle("");
      setSectionId("");
      setSemester("");
      setSubjectId("");
      setUnitNumber("");
      setFile(null);
      setMessage({
        type: "success",
        text: "Important question uploaded successfully.",
      });
      onCreated?.();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to upload the important question.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-400/15 bg-white/[0.035] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.10] blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-[90px]"
      />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/[0.10] text-blue-400">
            <UploadIcon />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400/80">
              Faculty Upload
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Upload Important Questions
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload a PDF or image and organise it by branch, section,
              semester, subject, and unit.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-8 space-y-6">
          <div>
            <label
              htmlFor="important-question-title"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
            >
              Title
            </label>

            <input
              id="important-question-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Unit 3 expected questions"
              minLength={1}
              maxLength={160}
              required
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-gray-700 focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="important-question-branch"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Branch
              </label>

              <select
                id="important-question-branch"
                value={branchId}
                onChange={(event) => {
                  setBranchId(event.target.value);
                  setSectionId("");
                  setSemester("");
                  setSubjectId("");
                }}
                required
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {branches.length === 0 ? (
                  <option value="" className="bg-[#080C13]">
                    No branches available
                  </option>
                ) : (
                  branches.map((branch) => (
                    <option
                      key={branch.id}
                      value={branch.slug}
                      className="bg-[#080C13]"
                    >
                      {branch.code} — {branch.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="important-question-section"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Section
              </label>

              <select
                id="important-question-section"
                value={sectionId}
                onChange={(event) => {
                  setSectionId(event.target.value);
                  setSemester("");
                  setSubjectId("");
                }}
                required
                disabled={!branchId || branchSections.length === 0 || loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-[#080C13]">
                  Select a section
                </option>

                {branchSections.map((section) => (
                  <option
                    key={section.id}
                    value={section.slug}
                    className="bg-[#080C13]"
                  >
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="important-question-semester"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Semester
              </label>

              <select
                id="important-question-semester"
                value={semester}
                onChange={(event) => {
                  setSemester(event.target.value);
                  setSubjectId("");
                }}
                required
                disabled={!sectionId || loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-[#080C13]">
                  Select semester
                </option>

                {Array.from({ length: 8 }, (_, index) => index + 1).map(
                  (semesterNumber) => (
                    <option
                      key={semesterNumber}
                      value={semesterNumber}
                      className="bg-[#080C13]"
                    >
                      Semester {semesterNumber}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="important-question-subject"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Subject
              </label>

              <select
                id="important-question-subject"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                required
                disabled={!semester || loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-[#080C13]">
                  {semester
                    ? "Select subject"
                    : "Select a semester first"}
                </option>

                {availableSubjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                    className="bg-[#080C13]"
                  >
                    {subjectLabel(subject)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="important-question-unit"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Unit
              </label>

              <select
                id="important-question-unit"
                value={unitNumber}
                onChange={(event) => setUnitNumber(event.target.value)}
                required
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-[#080C13]">
                  Select unit
                </option>

                {Array.from({ length: 20 }, (_, index) => index + 1).map(
                  (unit) => (
                    <option
                      key={unit}
                      value={unit}
                      className="bg-[#080C13]"
                    >
                      Unit {unit}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="important-question-file"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
            >
              File
            </label>

            <div className="rounded-2xl border border-dashed border-blue-400/20 bg-blue-500/[0.025] p-4 transition hover:border-blue-400/35 hover:bg-blue-500/[0.04]">
              <input
                id="important-question-file"
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp"
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
                required
                disabled={loading}
                className="w-full text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-300 file:transition hover:file:bg-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {file && (
                <p className="mt-3 text-xs text-blue-300/80">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-600">
              PDF up to 20 MB. JPEG, PNG, or WebP up to 10 MB.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/[0.12] py-3.5 text-sm font-semibold text-blue-300 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.18] hover:text-blue-200 hover:shadow-[0_12px_35px_rgba(59,130,246,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadIcon />
            {loading ? "Uploading..." : "Upload Important Questions"}
          </button>

          {message && (
            <div
              role={message.type === "error" ? "alert" : "status"}
              className={`rounded-2xl border p-4 text-center text-sm ${
                message.type === "success"
                  ? "border-blue-400/20 bg-blue-500/[0.06] text-blue-300"
                  : "border-red-400/20 bg-red-500/[0.06] text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}