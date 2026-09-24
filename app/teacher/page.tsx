"use client";

import { useEffect, useState } from "react";
import AuthButton from "@/components/AuthButton";
import ResourceItem from "@/components/admin/ResourceItem";
import UploadForm from "@/components/admin/UploadForm";
import AnnouncementForm from "@/components/teacher/AnnouncementForm";
import AnnouncementList from "@/components/teacher/AnnouncementList";
import ImportantQuestionsForm from "@/components/teacher/ImportantQuestionsForm";
import ImportantQuestionsList from "@/components/teacher/ImportantQuestionsList";

type Resource = {
  id: string;
  title: string;
  semester: number;
  subject: string;
  category: string;
  file_url: string;
  section_id?: string | null;
};

export default function TeacherPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [announcementRefreshKey, setAnnouncementRefreshKey] = useState(0);
  const [importantQuestionsRefreshKey, setImportantQuestionsRefreshKey] =
    useState(0);

  useEffect(() => {
    async function loadResources() {
      try {
        const res = await fetch("/api/teacher/resources");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load resources.");
          return;
        }

        setResources(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B12] text-white">
      {/* Ambient blue background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/[0.08] blur-[120px]" />
        <div className="absolute right-0 top-72 h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-500/[0.04] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="mb-10 rounded-3xl border border-blue-400/[0.1] bg-white/[0.025] px-6 py-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Faculty Portal
                </p>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Teacher Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Upload resources, publish announcements, and manage important
                questions for your students.
              </p>
            </div>

            <AuthButton variant="admin" />
          </div>
        </header>

        {/* Resources */}
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Library
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-white">
                My Resources
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the academic resources available to students.
              </p>
            </div>

            <span className="w-fit rounded-full border border-blue-400/[0.12] bg-blue-500/[0.05] px-3 py-1.5 text-xs font-medium text-blue-300">
              {resources.length}{" "}
              {resources.length === 1 ? "Resource" : "Resources"}
            </span>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-xl">
              <div className="h-4 w-40 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="mt-4 h-5 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.05] p-8 backdrop-blur-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/[0.1] bg-white/[0.02] p-10 text-center backdrop-blur-xl">
              <p className="text-sm text-gray-500">
                No resources uploaded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <ResourceItem key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </section>

        {/* Upload */}
        <UploadForm />

        {/* Divider */}
        <div className="my-14 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        {/* Announcements */}
        <section>
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Communication
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Announcements
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create and manage course updates for your students.
            </p>
          </div>

          <AnnouncementForm
            onCreated={() =>
              setAnnouncementRefreshKey((current) => current + 1)
            }
          />

          <AnnouncementList refreshKey={announcementRefreshKey} />
        </section>

        {/* Divider */}
        <div className="my-14 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        {/* Important Questions */}
        <section>
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Exam Preparation
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Important Questions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload and manage important questions for each course unit.
            </p>
          </div>

          <ImportantQuestionsForm
            onCreated={() =>
              setImportantQuestionsRefreshKey((current) => current + 1)
            }
          />

          <ImportantQuestionsList
            refreshKey={importantQuestionsRefreshKey}
          />
        </section>

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </main>
  );
}