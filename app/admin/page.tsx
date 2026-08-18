"use client";

import { useEffect, useState } from "react";

import AdminHeader from "@/components/admin/AdminHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import UploadForm from "@/components/admin/UploadForm";
import ResourceList from "@/components/admin/ResourceList";

type Resource = {
  id: string;
};

export default function AdminPage() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function loadResources() {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data);
    }

    loadResources();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F17]">
      <div className="mx-auto max-w-6xl px-8 py-10">

        <AdminHeader />

        <DashboardStats
          totalResources={resources.length}
        />

        <UploadForm />

        <ResourceList />

      </div>
    </main>
  );
}