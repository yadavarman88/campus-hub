"use client";

import { useState } from "react";
import { getSubjectsBySemester } from "@/lib/subjects";

type AnnouncementPayload = {
  title: string;
  content: string;
  semester: number | null;
  subject_id: string | null;
};

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

function validateAnnouncement(
  title: string,
  content: string,
  semester: string,
  subjectId: string
): { success: true; payload: AnnouncementPayload } | { success: false; error: string } {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (trimmedTitle.length < 1 || trimmedTitle.length > 160) {
    return {
      success: false,
      error: "Title must be between 1 and 160 characters.",
    };
  }

  if (trimmedContent.length < 1 || trimmedContent.length > 10000) {
    return {
      success: false,
      error: "Content must be between 1 and 10000 characters.",
    };
  }

  if (subjectId && !semester) {
    return {
      success: false,
      error: "Select a semester before choosing a subject.",
    };
  }

  return {
    success: true,
    payload: {
      title: trimmedTitle,
      content: trimmedContent,
      semester: semester ? Number(semester) : null,
      subject_id: subjectId || null,
    },
  };
}

export default function AnnouncementForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const availableSubjects = semester
    ? getSubjectsBySemester(Number(semester))
    : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateAnnouncement(title, content, semester, subjectId);

    if (!validation.success) {
      setMessage({ type: "error", text: validation.error });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/teacher/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.payload),
      });
      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiError(data, "Unable to create announcement."));
      }

      setTitle("");
      setContent("");
      setSemester("");
      setSubjectId("");
      setMessage({ type: "success", text: "Announcement published." });
      onCreated?.();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to create announcement.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
      <h3 className="text-2xl font-bold text-white">Create Announcement</h3>

      <p className="mt-2 text-gray-400">
        Share an update with all students or target a semester and subject.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="announcement-title" className="mb-2 block text-sm text-gray-400">
            Title
          </label>

          <input
            id="announcement-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter announcement title"
            minLength={1}
            maxLength={160}
            required
            disabled={loading}
            className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white placeholder-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="announcement-content" className="mb-2 block text-sm text-gray-400">
            Content
          </label>

          <textarea
            id="announcement-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your announcement"
            minLength={1}
            maxLength={10000}
            required
            disabled={loading}
            rows={6}
            className="w-full resize-y rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white placeholder-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="announcement-semester" className="mb-2 block text-sm text-gray-400">
              Semester <span className="text-gray-500">(optional)</span>
            </label>

            <select
              id="announcement-semester"
              value={semester}
              onChange={(event) => {
                setSemester(event.target.value);
                setSubjectId("");
              }}
              disabled={loading}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">All semesters</option>
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
            <label htmlFor="announcement-subject" className="mb-2 block text-sm text-gray-400">
              Subject <span className="text-gray-500">(optional)</span>
            </label>

            <select
              id="announcement-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              disabled={!semester || loading}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {semester ? "All subjects" : "Select a semester first"}
              </option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} — {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Announcement"}
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
