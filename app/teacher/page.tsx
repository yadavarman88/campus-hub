"use client";

import { useEffect, useState } from "react";
import AuthButton from "@/components/AuthButton";
import ResourceItem from "@/components/admin/ResourceItem";
import UploadForm from "@/components/admin/UploadForm";
import AnnouncementForm from "@/components/teacher/AnnouncementForm";
import AnnouncementList from "@/components/teacher/AnnouncementList";

type Resource = {
  id: string;
  title: string;
  semester: number;
  subject: string;
  category: string;
  file_url: string;
};

export default function TeacherPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [announcementRefreshKey, setAnnouncementRefreshKey] = useState(0);

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
    <main className="min-h-screen bg-[#0B0F17]">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Teacher Dashboard
            </h1>

            <p className="mt-2 text-gray-400">
              Upload and manage your course resources.
            </p>
          </div>

          <AuthButton variant="admin" />
        </header>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              My Resources
            </h2>

            <span className="rounded-full border border-[#2A2F3A] px-3 py-1 text-sm text-gray-400">
              {resources.length} Total
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
              <p className="text-gray-400">Loading your resources...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/50 bg-[#171A21] p-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2A2F3A] bg-[#171A21] p-10 text-center">
              <p className="text-gray-400">No resources uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <ResourceItem key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </section>

        <UploadForm />

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Announcements
            </h2>

            <p className="mt-1 text-gray-400">
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
      </div>
    </main>
  );
}
