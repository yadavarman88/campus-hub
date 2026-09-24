"use client";

import { useState } from "react";
import { getSubjectsBySemester } from "@/lib/subjects";
import { subjectLabel } from "@/lib/academic-data";

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
):
  | { success: true; payload: AnnouncementPayload }
  | { success: false; error: string } {
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

function AnnouncementIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M6.5 5.75h11a1.75 1.75 0 0 1 1.75 1.75v8.5a1.75 1.75 0 0 1-1.75 1.75h-6.1L8 20.25v-2.5H6.5a1.75 1.75 0 0 1-1.75-1.75V7.5A1.75 1.75 0 0 1 6.5 5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 10h7M8.5 13h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
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

    const validation = validateAnnouncement(
      title,
      content,
      semester,
      subjectId
    );

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
        throw new Error(
          getApiError(data, "Unable to create announcement.")
        );
      }

      setTitle("");
      setContent("");
      setSemester("");
      setSubjectId("");
      setMessage({
        type: "success",
        text: "Announcement published successfully.",
      });
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
            <AnnouncementIcon />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400/80">
              Faculty Communication
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Create Announcement
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Share an update with all students or target a specific semester
              and subject.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-8 space-y-6">
          <div>
            <label
              htmlFor="announcement-title"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
            >
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
              className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-gray-700 focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="announcement-content"
                className="block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Content
              </label>

              <span className="text-xs text-gray-700">
                {content.length}/10000
              </span>
            </div>

            <textarea
              id="announcement-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your announcement"
              minLength={1}
              maxLength={10000}
              required
              disabled={loading}
              rows={7}
              className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none backdrop-blur-xl transition placeholder:text-gray-700 focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="announcement-semester"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Semester{" "}
                <span className="normal-case tracking-normal text-gray-700">
                  (optional)
                </span>
              </label>

              <select
                id="announcement-semester"
                value={semester}
                onChange={(event) => {
                  setSemester(event.target.value);
                  setSubjectId("");
                }}
                disabled={loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-[#080C13]">
                  All semesters
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
                htmlFor="announcement-subject"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Subject{" "}
                <span className="normal-case tracking-normal text-gray-700">
                  (optional)
                </span>
              </label>

              <select
                id="announcement-subject"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                disabled={!semester || loading}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-[#080C13]">
                  {semester
                    ? "All subjects"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/[0.12] py-3.5 text-sm font-semibold text-blue-300 transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.18] hover:text-blue-200 hover:shadow-[0_12px_35px_rgba(59,130,246,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AnnouncementIcon />
            {loading ? "Publishing..." : "Publish Announcement"}
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