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

  return subject ? `${subject.code} — ${subject.name}` : "Subject unavailable";
}

function validateAnnouncement(
  draft: EditableAnnouncement
): { success: true; payload: AnnouncementPayload } | { success: false; error: string } {
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
          throw new Error(getApiError(data, "Unable to fetch announcements."));
        }

        const parsedAnnouncements = parseAnnouncements(data);

        if (!parsedAnnouncements) {
          throw new Error("Received an invalid announcement response.");
        }

        setAnnouncements(sortAnnouncements(parsedAnnouncements));
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
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
    setDraft({ title: "", content: "", semester: "", subjectId: "" });
  }

  async function saveAnnouncement(
    event: React.FormEvent<HTMLFormElement>,
    announcementId: string
  ) {
    event.preventDefault();

    const validation = validateAnnouncement(draft);

    if (!validation.success) {
      setMessage({ type: "error", text: validation.error });
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
        throw new Error(getApiError(data, "Unable to update announcement."));
      }

      if (!isRecord(data) || !isAnnouncement(data.announcement)) {
        throw new Error("Received an invalid announcement response.");
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
      setMessage({ type: "success", text: "Announcement updated." });
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
    if (!window.confirm("Delete this announcement? This action cannot be undone.")) {
      return;
    }

    setDeletingId(announcementId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/teacher/announcements/${announcementId}`,
        { method: "DELETE" }
      );
      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiError(data, "Unable to delete announcement."));
      }

      setAnnouncements((current) =>
        current.filter((announcement) => announcement.id !== announcementId)
      );

      if (editingId === announcementId) {
        cancelEditing();
      }

      setMessage({ type: "success", text: "Announcement deleted." });
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
      <div className="mt-6 rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
        <p className="text-gray-400">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Announcements</h3>

        <span className="rounded-full border border-[#2A2F3A] px-3 py-1 text-sm text-gray-400">
          {announcements.length} Total
        </span>
      </div>

      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={`mb-4 rounded-xl border p-4 ${
            message.type === "success"
              ? "border-green-500/50 bg-green-500/10 text-green-400"
              : "border-red-500/50 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      {error ? (
        <div className="rounded-2xl border border-red-500/50 bg-[#171A21] p-8">
          <p className="text-red-400">{error}</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2A2F3A] bg-[#171A21] p-10 text-center">
          <p className="text-gray-400">No announcements published yet.</p>
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
                className="rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-5 transition hover:border-gray-500"
              >
                {isEditing ? (
                  <form
                    onSubmit={(event) => saveAnnouncement(event, announcement.id)}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor={`announcement-title-${announcement.id}`}
                        className="mb-2 block text-sm text-gray-400"
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
                        className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`announcement-content-${announcement.id}`}
                        className="mb-2 block text-sm text-gray-400"
                      >
                        Content
                      </label>
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
                        className="w-full resize-y rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`announcement-semester-${announcement.id}`}
                          className="mb-2 block text-sm text-gray-400"
                        >
                          Semester <span className="text-gray-500">(optional)</span>
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
                        <label
                          htmlFor={`announcement-subject-${announcement.id}`}
                          className="mb-2 block text-sm text-gray-400"
                        >
                          Subject <span className="text-gray-500">(optional)</span>
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
                          disabled={!draft.semester || isSaving || isDeleting}
                          className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">
                            {draft.semester ? "All subjects" : "Select a semester first"}
                          </option>
                          {availableSubjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.code} — {subject.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={isSaving || isDeleting}
                        className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving || isDeleting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {announcement.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-400">
                          {announcement.semester
                            ? `Semester ${announcement.semester}`
                            : "All semesters"}{" "}
                          • {getSubjectLabel(announcement.subject_id)}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => beginEditing(announcement)}
                          disabled={isDeleting}
                          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(announcement.id)}
                          disabled={isDeleting}
                          className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap break-words text-gray-300">
                      {announcement.content}
                    </p>

                    <p className="mt-4 text-sm text-gray-500">
                      Published {formatDate(announcement.created_at)}
                    </p>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
