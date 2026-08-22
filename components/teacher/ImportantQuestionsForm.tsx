"use client";

import { useState } from "react";
import { getSubjectsBySemester } from "@/lib/subjects";

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

export default function ImportantQuestionsForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

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

    if (!semester || !subjectId || !unitNumber || !file) {
      setMessage({
        type: "error",
        text: "Choose a semester, subject, unit, and file before uploading.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", trimmedTitle);
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
      setSemester("");
      setSubjectId("");
      setUnitNumber("");
      setFile(null);
      setMessage({ type: "success", text: "Important question uploaded." });
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
    <div className="rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
      <h3 className="text-2xl font-bold text-white">
        Upload Important Questions
      </h3>

      <p className="mt-2 text-gray-400">
        Upload a PDF or image and organise it by semester, subject, and unit.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="important-question-title"
            className="mb-2 block text-sm text-gray-400"
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
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white placeholder-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="important-question-semester"
              className="mb-2 block text-sm text-gray-400"
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
              disabled={loading}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select semester</option>
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (semesterNumber) => (
                  <option key={semesterNumber} value={semesterNumber}>
                    Semester {semesterNumber}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="important-question-subject"
              className="mb-2 block text-sm text-gray-400"
            >
              Subject
            </label>

            <select
              id="important-question-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              required
              disabled={!semester || loading}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {semester ? "Select subject" : "Select a semester first"}
              </option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} — {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="important-question-unit"
              className="mb-2 block text-sm text-gray-400"
            >
              Unit
            </label>

            <select
              id="important-question-unit"
              value={unitNumber}
              onChange={(event) => setUnitNumber(event.target.value)}
              required
              disabled={loading}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select unit</option>
              {Array.from({ length: 20 }, (_, index) => index + 1).map(
                (unit) => (
                  <option key={unit} value={unit}>
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
            className="mb-2 block text-sm text-gray-400"
          >
            File
          </label>

          <input
            id="important-question-file"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
            disabled={loading}
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-gray-800 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-2 text-sm text-gray-500">
            PDF up to 20 MB; JPEG, PNG, or WebP up to 10 MB.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Important Questions"}
        </button>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`text-center ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
