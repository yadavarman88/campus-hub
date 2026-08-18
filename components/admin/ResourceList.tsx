"use client";

import { useEffect, useState } from "react";
import ResourceItem from "./ResourceItem";

type Resource = {
  id: string;
  title: string;
  semester: number;
  subject: string;
  category: string;
  file_url: string;
};

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        const res = await fetch("/api/resources");
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
        <p className="text-gray-400">Loading resources...</p>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Recent Resources
        </h2>

        <span className="rounded-full border border-[#2A2F3A] px-3 py-1 text-sm text-gray-400">
          {resources.length} Total
        </span>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2A2F3A] bg-[#171A21] p-10 text-center">
          <p className="text-gray-400">
            No resources uploaded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <ResourceItem
              key={resource.id}
              resource={resource}
            />
          ))}
        </div>
      )}
    </section>
  );
}