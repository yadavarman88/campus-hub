"use client";

import { useEffect, useState } from "react";
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
  updated_at: string;
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
    typeof value.created_at === "string" &&
    typeof value.updated_at === "string"
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

function getSubjectLabel(subjectId: string) {
  const subject = subjects.find((item) => item.id === subjectId);

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

export default function ImportantQuestionsList({ refreshKey = 0 }: Props) {
  const [importantQuestions, setImportantQuestions] = useState<
    ImportantQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<ListMessage | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadImportantQuestions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/teacher/important-questions", {
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
  }, [refreshKey]);

  async function downloadImportantQuestion(questionId: string) {
    setDownloadingId(questionId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/teacher/important-questions/${questionId}/download`
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

  async function deleteImportantQuestion(questionId: string) {
    if (!window.confirm("Delete this important question? This action cannot be undone.")) {
      return;
    }

    setDeletingId(questionId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/teacher/important-questions/${questionId}`,
        { method: "DELETE" }
      );
      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiError(data, "Unable to delete important question."));
      }

      setImportantQuestions((current) =>
        current.filter((question) => question.id !== questionId)
      );
      setMessage({ type: "success", text: "Important question deleted." });
    } catch (requestError) {
      setMessage({
        type: "error",
        text:
          requestError instanceof Error
            ? requestError.message
            : "Unable to delete important question.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
        <p className="text-gray-400">Loading important questions...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Uploads</h3>

        <span className="rounded-full border border-[#2A2F3A] px-3 py-1 text-sm text-gray-400">
          {importantQuestions.length} Total
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
      ) : importantQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2A2F3A] bg-[#171A21] p-10 text-center">
          <p className="text-gray-400">No important questions uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {importantQuestions.map((question) => {
            const isDownloading = downloadingId === question.id;
            const isDeleting = deletingId === question.id;

            return (
              <article
                key={question.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-5 transition hover:border-gray-500 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {question.title}
                  </h4>

                  <p className="mt-1 text-sm text-gray-400">
                    Semester {question.semester} • {getSubjectLabel(question.subject_id)} • Unit {question.unit_number}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {question.original_filename} • Published {formatDate(question.created_at)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => downloadImportantQuestion(question.id)}
                    disabled={isDownloading || isDeleting}
                    className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDownloading ? "Preparing..." : "Download"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteImportantQuestion(question.id)}
                    disabled={isDeleting || isDownloading}
                    className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
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
