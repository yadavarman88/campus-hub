import { Semester, Upload } from "./types";

export const semesters: Semester[] = [
  { id: 1, label: "I", title: "Semester I", subjectCount: 6 },
  { id: 2, label: "II", title: "Semester II", subjectCount: 6 },
  { id: 3, label: "III", title: "Semester III", subjectCount: 6 },
  { id: 4, label: "IV", title: "Semester IV", subjectCount: 6 },
  { id: 5, label: "V", title: "Semester V", subjectCount: 5 },
  { id: 6, label: "VI", title: "Semester VI", subjectCount: 5 },
  { id: 7, label: "VII", title: "Semester VII", subjectCount: 5 },
  { id: 8, label: "VIII", title: "Semester VIII", subjectCount: 4 },
];

export const latestUploads: Upload[] = [
  {
    id: "u1",
    title: "Unit 4 — Two-Port Networks, complete notes",
    subjectCode: "ECE-201",
    subjectName: "Network Analysis",
    type: "Notes",
    uploadedAgo: "2 hours ago",
  },
  {
    id: "u2",
    title: "Mid-semester question paper, 2025",
    subjectCode: "ECE-203",
    subjectName: "Analog Electronics",
    type: "Previous Year Paper",
    uploadedAgo: "5 hours ago",
  },
  {
    id: "u3",
    title: "Updated unit-wise syllabus, 2026 batch",
    subjectCode: "ECE-205",
    subjectName: "Signals & Systems",
    type: "Syllabus",
    uploadedAgo: "1 day ago",
  },
  {
    id: "u4",
    title: "Experiment 6 — Flip-Flops & Counters",
    subjectCode: "ECE-207",
    subjectName: "Digital Electronics",
    type: "Lab Manual",
    uploadedAgo: "1 day ago",
  },
  {
    id: "u5",
    title: "Unit 2 — Interfacing, revised notes",
    subjectCode: "ECE-251",
    subjectName: "MPMC",
    type: "Notes",
    uploadedAgo: "2 days ago",
  },
  {
    id: "u6",
    title: "End-semester paper with solutions, 2024",
    subjectCode: "ECE-253",
    subjectName: "EMFT",
    type: "Previous Year Paper",
    uploadedAgo: "3 days ago",
  },
];
