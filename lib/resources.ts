import { Resource } from "./types";

export const resources: Resource[] = [
  // =========================
  // MPMC
  // =========================

  { id: "mpmc-note-1", semesterId: 4, subjectId: "mpmc", category: "notes", title: "Unit 1", file: "/pdfs/mpmc/unit1.pdf", type: "PDF" },
  { id: "mpmc-note-2", semesterId: 4, subjectId: "mpmc", category: "notes", title: "Unit 2", file: "/pdfs/mpmc/unit2.pdf", type: "PDF" },
  { id: "mpmc-note-3", semesterId: 4, subjectId: "mpmc", category: "notes", title: "Unit 3", file: "/pdfs/mpmc/unit3.pdf", type: "PDF" },
  { id: "mpmc-note-4", semesterId: 4, subjectId: "mpmc", category: "notes", title: "Unit 4", file: "/pdfs/mpmc/unit4.pdf", type: "PDF" },
  { id: "mpmc-complete", semesterId: 4, subjectId: "mpmc", category: "notes", title: "Complete Notes", file: "/pdfs/mpmc/complete-notes.pdf", type: "PDF" },

  { id: "mpmc-syllabus", semesterId: 4, subjectId: "mpmc", category: "syllabus", title: "Syllabus", file: "/pdfs/mpmc/syllabus.pdf", type: "PDF" },

  { id: "mpmc-pyq-2023", semesterId: 4, subjectId: "mpmc", category: "previous-year-papers", title: "Previous Year Paper 2023", file: "/pdfs/mpmc/pyq-2023.pdf", type: "PDF" },
  { id: "mpmc-pyq-2024", semesterId: 4, subjectId: "mpmc", category: "previous-year-papers", title: "Previous Year Paper 2024", file: "/pdfs/mpmc/pyq-2024.pdf", type: "PDF" },

  { id: "mpmc-iq-1", semesterId: 4, subjectId: "mpmc", category: "important-questions", title: "Important Questions Set 1", file: "/pdfs/mpmc/important-questions-1.pdf", type: "PDF" },
  { id: "mpmc-iq-2", semesterId: 4, subjectId: "mpmc", category: "important-questions", title: "Important Questions Set 2", file: "/pdfs/mpmc/important-questions-2.pdf", type: "PDF" },

  { id: "mpmc-topics", semesterId: 4, subjectId: "mpmc", category: "important-topics", title: "Important Topics", file: "/pdfs/mpmc/important-topics.pdf", type: "PDF" },

  { id: "mpmc-lab", semesterId: 4, subjectId: "mpmc", category: "lab-manual", title: "Lab Manual", file: "/pdfs/mpmc/lab-manual.pdf", type: "PDF" },

  // =========================
  // Network Analysis
  // =========================

  { id: "na-note-1", semesterId: 3, subjectId: "network-analysis", category: "notes", title: "Unit 1", file: "/pdfs/network-analysis/unit1.pdf", type: "PDF" },
  { id: "na-note-2", semesterId: 3, subjectId: "network-analysis", category: "notes", title: "Unit 2", file: "/pdfs/network-analysis/unit2.pdf", type: "PDF" },
  { id: "na-note-3", semesterId: 3, subjectId: "network-analysis", category: "notes", title: "Unit 3", file: "/pdfs/network-analysis/unit3.pdf", type: "PDF" },
  { id: "na-note-4", semesterId: 3, subjectId: "network-analysis", category: "notes", title: "Unit 4", file: "/pdfs/network-analysis/unit4.pdf", type: "PDF" },
  { id: "na-complete", semesterId: 3, subjectId: "network-analysis", category: "notes", title: "Complete Notes", file: "/pdfs/network-analysis/complete-notes.pdf", type: "PDF" },

  { id: "na-syllabus", semesterId: 3, subjectId: "network-analysis", category: "syllabus", title: "Syllabus", file: "/pdfs/network-analysis/syllabus.pdf", type: "PDF" },

  { id: "na-pyq-2023", semesterId: 3, subjectId: "network-analysis", category: "previous-year-papers", title: "Previous Year Paper 2023", file: "/pdfs/network-analysis/pyq-2023.pdf", type: "PDF" },
  { id: "na-pyq-2024", semesterId: 3, subjectId: "network-analysis", category: "previous-year-papers", title: "Previous Year Paper 2024", file: "/pdfs/network-analysis/pyq-2024.pdf", type: "PDF" },

  { id: "na-iq-1", semesterId: 3, subjectId: "network-analysis", category: "important-questions", title: "Important Questions Set 1", file: "/pdfs/network-analysis/important-questions-1.pdf", type: "PDF" },
  { id: "na-iq-2", semesterId: 3, subjectId: "network-analysis", category: "important-questions", title: "Important Questions Set 2", file: "/pdfs/network-analysis/important-questions-2.pdf", type: "PDF" },

  { id: "na-topics", semesterId: 3, subjectId: "network-analysis", category: "important-topics", title: "Important Topics", file: "/pdfs/network-analysis/important-topics.pdf", type: "PDF" },

  { id: "na-lab", semesterId: 3, subjectId: "network-analysis", category: "lab-manual", title: "Lab Manual", file: "/pdfs/network-analysis/lab-manual.pdf", type: "PDF" },
];

export function getResources(
  semesterId: number,
  subjectId: string,
  category: string
): Resource[] {
  return resources.filter(
    (resource) =>
      resource.semesterId === semesterId &&
      resource.subjectId === subjectId &&
      resource.category === category
  );
}