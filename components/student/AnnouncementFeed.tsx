"use client";

import { useEffect, useState } from "react";
import { subjects } from "@/lib/subjects";

type Announcement = {
  id: string;
  title: string;
  content: string;
  semester: number | null;
  subject_id: string | null;
  created_at: string;
  updated_at: string;
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

function parseAnnouncements(data: unknown): Announcement[] | null {
  if (!isRecord(data) || !Array.isArray(data.announcements)) {
    return null;
  }

  const announcements: Announcement[] = [];

  for (const announcement of data.announcements) {
    if (!isAnnouncement(announcement)) {
      return null;
    }

    announcements.push(announcement);
  }

  return announcements;
}

function getApiError(data: unknown, fallback: string) {
  if (isRecord(data) && typeof data.error === "string") {
    return data.error;
  }

  return fallback;
}

function getTargetLabel(announcement: Announcement) {
  if (announcement.semester === null && announcement.subject_id === null) {
    return "All Students";
  }

  if (announcement.subject_id === null) {
    return `Semester ${announcement.semester}`;
  }

  const subject = subjects.find(
    (item) =>
      item.id === announcement.subject_id &&
      item.semesterId === announcement.semester
  );

  return subject
    ? `Semester ${announcement.semester} • ${subject.code} — ${subject.name}`
    : `Semester ${announcement.semester} • Subject`;
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

export default function AnnouncementFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnnouncements() {
      try {
        const response = await fetch("/api/student/announcements", {
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

        setAnnouncements(parsedAnnouncements);
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
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          Loading announcements...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-8 dark:border-red-500/50 dark:bg-red-950/30">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          No announcements for your semester yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            {getTargetLabel(announcement)}
          </p>

          <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {announcement.title}
          </h3>

          <p className="mt-3 whitespace-pre-wrap break-words text-gray-600 dark:text-gray-300">
            {announcement.content}
          </p>

          <p className="mt-5 text-sm text-gray-400">
            Published {formatDate(announcement.created_at)}
          </p>
        </article>
      ))}
    </div>
  );
}
