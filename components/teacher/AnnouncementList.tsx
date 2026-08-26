"use client";

import { useEffect, useState } from "react";
import { getSubjectsBySemester, subjects } from "@/lib/subjects";

type Announcement = {
  id: string;
  title: string;
  content: string;
  semester: number | null;
  subject_id: string | null;
  created_at: string;
  updated_at: string;
};

type EditableAnnouncement = {
  title: string;
  content: string;
  semester: string;
  subjectId: string;
};

type AnnouncementPayload = {
  title: string;
  content: string;
  semester: number | null;
  subject_id: string | null;
};

type ListMessage = {
  type: "success" | "error";
  text: string;
};

type Props = {
  refreshKey?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAnnouncement(value: unknown): value is Announcement {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    (value.semester === null || typeof value.semester === "number") &&
    (value.subject_id === null || typeof value.subject_id === "string") &&
    typeof value.created_at === "string" &&
    typeof value.updated_at === "string"
  );
}

function getApiError(data: unknown, fallback: string) {
  if (isRecord(data) && typeof data.error === "string") {
    return data.error;
  }

  return fallback;
}

function parseAnnouncements(data: unknown): Announcement[] | null {
  if (!isRecord(data) || !Array.isArray(data.announcements)) {
    return null;
  }

  const parsedAnnouncements: Announcement[] = [];

  for (const announcement of data.announcements) {
    if (!isAnnouncement(announcement)) {
      return null;
    }

    parsedAnnouncements.push(announcement);
  }

  return parsedAnnouncements;
}

function sortAnnouncements(announcements: Announcement[]) {
  return [...announcements].sort(
    (first, second) =>
      new Date(second.created_at).getTime() -
      new Date(first.created_at).getTime()
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getSubjectLabel(subjectId: string | null) {
  if (!subjectId) {
    return "All subjects";
  }

  const subject = subjects.find((item) => item.id === subjectId);

  return subject
    ? `${subject.code} — ${subject.name}`
    : "Subject unavailable";
}

function validateAnnouncement(
  draft: EditableAnnouncement
):
  | { success: true; payload: AnnouncementPayload }
  | { success: false; error: string } {
  const title = draft.title.trim();
  const content = draft.content.trim();

  if (title.length < 1 || title.length > 160) {
    return {
      success: false,
      error: "Title must be between 1 and 160 characters.",
    };
  }

  if (content.length < 1 || content.length > 10000) {
    return {
      success: false,
      error: "Content must be between 1 and 10000 characters.",
    };
  }

  if (draft.subjectId && !draft.semester) {
    return {
      success: false,
      error: "Select a semester before choosing a subject.",
    };
  }

  return {
    success: true,
    payload: {
      title,
      content,
      semester: draft.semester ? Number(draft.semester) : null,
      subject_id: draft.subjectId || null,
    },
  };
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="m14.5 6.5 3 3M5.5 18.5l.75-3.75L15.8 5.2a1.7 1.7 0 0 1 2.4 0l.6.6a1.7 1.7 0 0 1 0 2.4l-9.55 9.55-3.75.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M5.5 7.5h13M9 7.5V5.75c0-.41.34-.75.75-.75h4.5c.41 0 .75.34.75.75V7.5M8 10.5v7M12 10.5v7M16 10.5v7M7 7.5l.75 12h8.5L17 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnnouncementList({ refreshKey = 0 }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<ListMessage | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [draft, setDraft] = useState<EditableAnnouncement>({
    title: "",
    content: "",
    semester: "",
    subjectId: "",
  });

  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnnouncements() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/teacher/announcements", {
          signal: controller.signal,
        });

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getApiError(data, "Unable to fetch announcements.")
          );
        }

        const parsedAnnouncements = parseAnnouncements(data);

        if (!parsedAnnouncements) {
          throw new Error(
            "Received an invalid announcement response."
          );
        }

        setAnnouncements(sortAnnouncements(parsedAnnouncements));
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to fetch announcements."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAnnouncements();

    return () => controller.abort();
  }, [refreshKey]);

  function beginEditing(announcement: Announcement) {
    setEditingId(announcement.id);

    setDraft({
      title: announcement.title,
      content: announcement.content,
      semester: announcement.semester?.toString() ?? "",
      subjectId: announcement.subject_id ?? "",
    });

    setMessage(null);
  }

  function cancelEditing() {
    setEditingId(null);

    setDraft({
      title: "",
      content: "",
      semester: "",
      subjectId: "",
    });
  }

  async function saveAnnouncement(
    event: React.FormEvent<HTMLFormElement>,
    announcementId: string
  ) {
    event.preventDefault();

    const validation = validateAnnouncement(draft);

    if (!validation.success) {
      setMessage({
        type: "error",
        text: validation.error,
      });
      return;
    }

    setSavingId(announcementId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/teacher/announcements/${announcementId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.payload),
        }
      );

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiError(data, "Unable to update announcement.")
        );
      }

      if (!isRecord(data) || !isAnnouncement(data.announcement)) {
        throw new Error(
          "Received an invalid announcement response."
        );
      }

      const updatedAnnouncement = data.announcement;

      setAnnouncements((current) =>
        sortAnnouncements(
          current.map((announcement) =>
            announcement.id === announcementId
              ? updatedAnnouncement
              : announcement
          )
        )
      );

      cancelEditing();

      setMessage({
        type: "success",
        text: "Announcement updated.",
      });
    } catch (requestError) {
      setMessage({
        type: "error",
        text:
          requestError instanceof Error
            ? requestError.message
            : "Unable to update announcement.",
      });
    } finally {
      setSavingId(null);
    }
  }

  async function deleteAnnouncement(announcementId: string) {
    if (
      !window.confirm(
        "Delete this announcement? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(announcementId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/teacher/announcements/${announcementId}`,
        {
          method: "DELETE",
        }
      );

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiError(data, "Unable to delete announcement.")
        );
      }

      setAnnouncements((current) =>
        current.filter(
          (announcement) => announcement.id !== announcementId
        )
      );

      if (editingId === announcementId) {
        cancelEditing();
      }

      setMessage({
        type: "success",
        text: "Announcement deleted.",
      });
    } catch (requestError) {
      setMessage({
        type: "error",
        text:
          requestError instanceof Error
            ? requestError.message
            : "Unable to delete announcement.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="relative mt-6 overflow-hidden rounded-3xl border border-blue-400/10 bg-white/[0.025] p-8 backdrop-blur-2xl">
        <div className="h-4 w-40 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="mt-4 h-5 w-56 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-lg bg-white/[0.05]" />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400/70">
            Published Updates
          </p>

          <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Your Announcements
          </h3>
        </div>

        <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.05] px-3 py-1 text-xs font-medium text-blue-300/80">
          {announcements.length} Total
        </span>
      </div>

      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={`mb-5 rounded-2xl border p-4 text-sm ${
            message.type === "success"
              ? "border-blue-400/20 bg-blue-500/[0.06] text-blue-300"
              : "border-red-400/20 bg-red-500/[0.06] text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {error ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.05] p-8 backdrop-blur-xl">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-10 text-center backdrop-blur-xl">
          <p className="text-sm text-gray-500">
            No announcements published yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const isEditing = editingId === announcement.id;
            const isSaving = savingId === announcement.id;
            const isDeleting = deletingId === announcement.id;

            const availableSubjects = draft.semester
              ? getSubjectsBySemester(Number(draft.semester))
              : [];

            return (
              <article
                key={announcement.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/20 hover:bg-white/[0.045] hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-40 w-40 rounded-full bg-blue-500/[0.06] blur-[70px] transition-opacity group-hover:bg-blue-500/[0.10]"
                />

                {isEditing ? (
                  <form
                    onSubmit={(event) =>
                      saveAnnouncement(event, announcement.id)
                    }
                    className="relative space-y-5"
                  >
                    <div>
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400/70">
                        Editing Announcement
                      </p>

                      <label
                        htmlFor={`announcement-title-${announcement.id}`}
                        className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
                      >
                        Title
                      </label>

                      <input
                        id={`announcement-title-${announcement.id}`}
                        type="text"
                        value={draft.title}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        minLength={1}
                        maxLength={160}
                        required
                        disabled={isSaving || isDeleting}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor={`announcement-content-${announcement.id}`}
                          className="block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
                        >
                          Content
                        </label>

                        <span className="text-xs text-gray-700">
                          {draft.content.length}/10000
                        </span>
                      </div>

                      <textarea
                        id={`announcement-content-${announcement.id}`}
                        value={draft.content}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        minLength={1}
                        maxLength={10000}
                        required
                        rows={6}
                        disabled={isSaving || isDeleting}
                        className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`announcement-semester-${announcement.id}`}
                          className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
                        >
                          Semester{" "}
                          <span className="normal-case tracking-normal text-gray-700">
                            (optional)
                          </span>
                        </label>

                        <select
                          id={`announcement-semester-${announcement.id}`}
                          value={draft.semester}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              semester: event.target.value,
                              subjectId: "",
                            }))
                          }
                          disabled={isSaving || isDeleting}
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="" className="bg-[#080C13]">
                            All semesters
                          </option>

                          {Array.from(
                            { length: 8 },
                            (_, index) => index + 1
                          ).map((semesterNumber) => (
                            <option
                              key={semesterNumber}
                              value={semesterNumber}
                              className="bg-[#080C13]"
                            >
                              Semester {semesterNumber}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`announcement-subject-${announcement.id}`}
                          className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
                        >
                          Subject{" "}
                          <span className="normal-case tracking-normal text-gray-700">
                            (optional)
                          </span>
                        </label>

                        <select
                          id={`announcement-subject-${announcement.id}`}
                          value={draft.subjectId}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              subjectId: event.target.value,
                            }))
                          }
                          disabled={
                            !draft.semester ||
                            isSaving ||
                            isDeleting
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-blue-400/40 focus:bg-white/[0.055] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="" className="bg-[#080C13]">
                            {draft.semester
                              ? "All subjects"
                              : "Select a semester first"}
                          </option>

                          {availableSubjects.map((subject) => (
                            <option
                              key={subject.id}
                              value={subject.id}
                              className="bg-[#080C13]"
                            >
                              {subject.code} — {subject.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 border-t border-white/[0.06] pt-5">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={isSaving || isDeleting}
                        className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSaving || isDeleting}
                        className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.12] px-5 py-2.5 text-sm font-semibold text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/[0.18] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="relative">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-300/80">
                            Announcement
                          </span>

                          <span className="text-xs text-gray-600">
                            {formatDate(announcement.created_at)}
                          </span>
                        </div>

                        <h4 className="mt-4 text-xl font-semibold tracking-tight text-white">
                          {announcement.title}
                        </h4>

                        <p className="mt-2 text-sm text-gray-500">
                          {announcement.semester
                            ? `Semester ${announcement.semester}`
                            : "All semesters"}{" "}
                          <span className="text-gray-700">•</span>{" "}
                          {getSubjectLabel(announcement.subject_id)}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            beginEditing(announcement)
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/15 bg-blue-500/[0.05] px-3.5 py-2 text-sm font-medium text-blue-300 transition hover:border-blue-400/30 hover:bg-blue-500/[0.10] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <EditIcon />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteAnnouncement(announcement.id)
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.04] px-3.5 py-2 text-sm font-medium text-red-300 transition hover:border-red-400/30 hover:bg-red-500/[0.10] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <DeleteIcon />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/[0.10] p-4">
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-400">
                        {announcement.content}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <p className="text-xs text-gray-600">
                        Published {formatDate(announcement.created_at)}
                      </p>

                      {announcement.updated_at !==
                        announcement.created_at && (
                        <p className="text-xs text-blue-400/50">
                          Updated
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}