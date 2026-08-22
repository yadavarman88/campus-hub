"use client";

import { useEffect, useMemo, useState } from "react";
import { subjects } from "@/lib/subjects";

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

function parseImportantQuestions(data: unknown): ImportantQuestion[] | null {
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

  return subject ? `${subject.code} — ${subject.name}` : "Subject unavailable";
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
          throw new Error("Received an invalid important question response.");
        }

        setImportantQuestions(parsedImportantQuestions);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
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
              label: getSubjectLabel(question.subject_id, question.semester),
            },
          ])
        ).values()
      ).sort((first, second) => first.label.localeCompare(second.label)),
    [importantQuestions]
  );

  const unitOptions = useMemo(
    () =>
      Array.from(
        new Set(importantQuestions.map((question) => question.unit_number))
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
        throw new Error(getApiError(data, "Unable to create a download link."));
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
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          Loading important questions...
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

  return (
    <div>
      {message && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-500/50 dark:bg-red-950/30 dark:text-red-300"
        >
          {message.text}
        </p>
      )}

      {importantQuestions.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="student-important-question-subject"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject
            </label>
            <select
              id="student-important-question-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">All subjects</option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="student-important-question-unit"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Unit
            </label>
            <select
              id="student-important-question-unit"
              value={unitNumber}
              onChange={(event) => setUnitNumber(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">All units</option>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  Unit {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {importantQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">
            No important questions for your semester yet.
          </p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">
            No important questions match the selected filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => {
            const isDownloading = downloadingId === question.id;

            return (
              <article
                key={question.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Semester {question.semester} • {getSubjectLabel(question.subject_id, question.semester)} • Unit {question.unit_number}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    {question.title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {question.original_filename} • Published {formatDate(question.created_at)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => downloadImportantQuestion(question.id)}
                  disabled={isDownloading}
                  className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  {isDownloading ? "Preparing..." : "Download"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
