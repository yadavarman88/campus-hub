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
          throw new Error(
            getApiError(data, "Unable to fetch announcements.")
          );
        }

        const parsedAnnouncements = parseAnnouncements(data);

        if (!parsedAnnouncements) {
          throw new Error("Received an invalid announcement response.");
        }

        setAnnouncements(parsedAnnouncements);
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
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-orange-500/10" />

          <div className="flex-1 space-y-3">
            <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="h-5 w-56 animate-pulse rounded-lg bg-white/[0.07]" />
            <div className="h-3 w-full animate-pulse rounded-lg bg-white/[0.05]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.06] p-8 backdrop-blur-xl">
        <p className="text-sm font-medium text-red-300">{error}</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-12 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/15 bg-orange-500/[0.07] text-orange-400">
          <AnnouncementIcon />
        </div>

        <p className="mt-5 text-sm font-medium text-gray-300">
          No announcements yet.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Faculty announcements for your semester will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/25 hover:bg-white/[0.05] hover:shadow-[0_18px_55px_rgba(249,115,22,0.08)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-orange-500/[0.07] blur-[80px] transition-all duration-300 group-hover:bg-orange-500/[0.14]"
          />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/15 bg-orange-500/[0.07] text-orange-400">
                <AnnouncementIcon />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full border border-orange-400/15 bg-orange-500/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-300">
                    {getTargetLabel(announcement)}
                  </span>

                  <span className="text-xs text-gray-600">
                    {formatDate(announcement.created_at)}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  {announcement.title}
                </h3>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-400">
                  {announcement.content}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="text-xs uppercase tracking-[0.14em] text-gray-600">
                    Faculty announcement
                  </span>

                  <span className="text-xs text-gray-600">
                    Published {formatDate(announcement.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}