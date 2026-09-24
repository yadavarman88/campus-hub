"use client";

import { useEffect, useMemo, useState } from "react";
import { subjects } from "@/lib/subjects";
import { subjectLabel } from "@/lib/academic-data";

type ImportantQuestion = {
  id: string;
  title: string;
  semester: number;
  subject_id: string;
  unit_number: number;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  created_at: string;
};

type BrowserMessage = {
  type: "error";
  text: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isImportantQuestion(value: unknown): value is ImportantQuestion {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.semester === "number" &&
    typeof value.subject_id === "string" &&
    typeof value.unit_number === "number" &&
    typeof value.original_filename === "string" &&
    typeof value.mime_type === "string" &&
    typeof value.file_size_bytes === "number" &&
    typeof value.created_at === "string"
  );
}

function parseImportantQuestions(
  data: unknown
): ImportantQuestion[] | null {
  if (!isRecord(data) || !Array.isArray(data.important_questions)) {
    return null;
  }

  const importantQuestions: ImportantQuestion[] = [];

  for (const question of data.important_questions) {
    if (!isImportantQuestion(question)) {
      return null;
    }

    importantQuestions.push(question);
  }

  return importantQuestions;
}

function getApiError(data: unknown, fallback: string) {
  if (isRecord(data) && typeof data.error === "string") {
    return data.error;
  }

  return fallback;
}

function getSubjectLabel(subjectId: string, semester: number) {
  const subject = subjects.find(
    (item) => item.id === subjectId && item.semesterId === semester
  );

  return subject ? subjectLabel(subject) : "Subject unavailable";
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

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M7 3.75h6.5L18.5 8.75V20a.75.75 0 0 1-.75.75h-10A.75.75 0 0 1 7 20V3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M13.5 3.75V9h5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.75 13h4.5M9.75 16h4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M12 4v11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m7.5 11.5 4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ImportantQuestionsBrowser() {
  const [importantQuestions, setImportantQuestions] = useState<
    ImportantQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<BrowserMessage | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadImportantQuestions() {
      try {
        const response = await fetch("/api/student/important-questions", {
          signal: controller.signal,
        });

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getApiError(data, "Unable to fetch important questions.")
          );
        }

        const parsedImportantQuestions = parseImportantQuestions(data);

        if (!parsedImportantQuestions) {
          throw new Error(
            "Received an invalid important question response."
          );
        }

        setImportantQuestions(parsedImportantQuestions);
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
            : "Unable to fetch important questions."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadImportantQuestions();

    return () => controller.abort();
  }, []);

  const subjectOptions = useMemo(
    () =>
      Array.from(
        new Map(
          importantQuestions.map((question) => [
            question.subject_id,
            {
              id: question.subject_id,
              label: getSubjectLabel(
                question.subject_id,
                question.semester
              ),
            },
          ])
        ).values()
      ).sort((first, second) =>
        first.label.localeCompare(second.label)
      ),
    [importantQuestions]
  );

  const unitOptions = useMemo(
    () =>
      Array.from(
        new Set(
          importantQuestions.map((question) => question.unit_number)
        )
      ).sort((first, second) => first - second),
    [importantQuestions]
  );

  const filteredQuestions = importantQuestions.filter(
    (question) =>
      (!subjectId || question.subject_id === subjectId) &&
      (!unitNumber || question.unit_number === Number(unitNumber))
  );

  async function downloadImportantQuestion(questionId: string) {
    setDownloadingId(questionId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/student/important-questions/${questionId}/download`
      );

      const data: unknown = await response.json().catch(() => null);

      if (
        !response.ok ||
        !isRecord(data) ||
        typeof data.download_url !== "string"
      ) {
        throw new Error(
          getApiError(data, "Unable to create a download link.")
        );
      }

      window.location.assign(data.download_url);
    } catch (requestError) {
      setMessage({
        type: "error",
        text:
          requestError instanceof Error
            ? requestError.message
            : "Unable to create a download link.",
      });
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-orange-500/10" />

          <div className="space-y-3">
            <div className="h-4 w-36 animate-pulse rounded-full bg-white/10" />
            <div className="h-3 w-56 animate-pulse rounded-full bg-white/[0.06]" />
          </div>
        </div>

        <div className="mt-8 h-12 animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="mt-3 h-12 animate-pulse rounded-2xl bg-white/[0.04]" />
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

  return (
    <div>
      {message && (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-4 backdrop-blur-xl"
        >
          <p className="text-sm text-red-300">{message.text}</p>
        </div>
      )}

      {importantQuestions.length > 0 && (
        <div className="mb-6 rounded-3xl border border-white/10 bg-black/10 p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400/80">
                Filter library
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Narrow questions by subject or unit.
              </p>
            </div>

            <span className="rounded-full border border-orange-400/15 bg-orange-500/[0.07] px-3 py-1 text-xs font-medium text-orange-300">
              {filteredQuestions.length}{" "}
              {filteredQuestions.length === 1 ? "file" : "files"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="student-important-question-subject"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Subject
              </label>

              <select
                id="student-important-question-subject"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-orange-400/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-orange-500/10"
              >
                <option value="" className="bg-[#0B0F17]">
                  All subjects
                </option>

                {subjectOptions.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                    className="bg-[#0B0F17]"
                  >
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="student-important-question-unit"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500"
              >
                Unit
              </label>

              <select
                id="student-important-question-unit"
                value={unitNumber}
                onChange={(event) => setUnitNumber(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-200 outline-none backdrop-blur-xl transition focus:border-orange-400/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-orange-500/10"
              >
                <option value="" className="bg-[#0B0F17]">
                  All units
                </option>

                {unitOptions.map((unit) => (
                  <option
                    key={unit}
                    value={unit}
                    className="bg-[#0B0F17]"
                  >
                    Unit {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {importantQuestions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-12 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/15 bg-orange-500/[0.07] text-orange-400">
            <FileIcon />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-300">
            No important questions available yet.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Faculty uploads for your semester will appear here.
          </p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-12 text-center backdrop-blur-xl">
          <p className="text-sm font-medium text-gray-300">
            No questions match your filters.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try selecting a different subject or unit.
          </p>

          <button
            type="button"
            onClick={() => {
              setSubjectId("");
              setUnitNumber("");
            }}
            className="mt-5 rounded-xl border border-orange-400/20 bg-orange-500/[0.08] px-4 py-2 text-sm font-medium text-orange-300 transition hover:border-orange-400/40 hover:bg-orange-500/[0.14]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            const isDownloading = downloadingId === question.id;

            return (
              <article
                key={question.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/25 hover:bg-white/[0.05] hover:shadow-[0_18px_55px_rgba(249,115,22,0.08)] sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-orange-500/[0.07] blur-[80px] transition-opacity duration-300 group-hover:bg-orange-500/[0.13]"
                />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/15 bg-orange-500/[0.07] text-orange-400">
                      <FileIcon />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-orange-400/15 bg-orange-500/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-300">
                          Unit {question.unit_number}
                        </span>

                        <span className="text-xs text-gray-600">
                          Semester {question.semester}
                        </span>
                      </div>

                      <h3 className="mt-3 break-words text-lg font-semibold tracking-tight text-white">
                        {question.title}
                      </h3>

                      <p className="mt-1 break-words text-sm text-gray-400">
                        {getSubjectLabel(
                          question.subject_id,
                          question.semester
                        )}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                        <span>{question.original_filename}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatFileSize(question.file_size_bytes)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDate(question.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      downloadImportantQuestion(question.id)
                    }
                    disabled={isDownloading}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-400/20 bg-orange-500/[0.09] px-4 py-2.5 text-sm font-semibold text-orange-300 transition-all duration-200 hover:border-orange-400/40 hover:bg-orange-500/[0.16] hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <DownloadIcon />
                    {isDownloading ? "Preparing..." : "Download"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}