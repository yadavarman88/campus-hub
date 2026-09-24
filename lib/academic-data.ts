import { Branch, Section, Subject } from "./types";

// The single authoritative source of the academic hierarchy. Everything else in
// the app must read from here. Only ECE Semester 5 is currently active; no
// other branch or semester exists in academic data.

export const branches: Branch[] = [
  {
    id: "ece",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    slug: "ece",
  },
];

export const sections: Section[] = [
  { id: "ece-morning-1", branchId: "ece", name: "Morning 1", slug: "ece-morning-1" },
  { id: "ece-morning-2", branchId: "ece", name: "Morning 2", slug: "ece-morning-2" },
  { id: "ece-evening", branchId: "ece", name: "Evening", slug: "ece-evening" },
];

// Canonical ECE Semester 5 subjects. `name` is intentionally left empty for
// EFE because its full form is not defined.
export const subjects: Subject[] = [
  {
    id: "dsp",
    semesterId: 5,
    code: "DSP",
    name: "Digital Signal Processing",
    aliases: ["digital-signal-processing"],
  },
  {
    id: "me",
    semesterId: 5,
    code: "ME",
    name: "Microelectronics",
  },
  {
    id: "dcn",
    semesterId: 5,
    code: "DCN",
    name: "Digital Communication",
    aliases: ["digital-communication"],
  },
  {
    id: "efe",
    semesterId: 5,
    code: "EFE",
    name: "",
  },
  {
    id: "twa",
    semesterId: 5,
    code: "TWA",
    name: "Antenna & Wave Propagation",
    aliases: ["antenna-and-wave-propagation"],
  },
  {
    id: "cs",
    semesterId: 5,
    code: "CS",
    name: "Computer Networks",
    aliases: ["computer-networks"],
  },
];

export const ACTIVE_SEMESTERS = [5];

export function getBranches(): Branch[] {
  return branches;
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

export function getSectionsByBranch(branchId: string): Section[] {
  return sections.filter((section) => section.branchId === branchId);
}

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((section) => section.slug === slug);
}

export function getSectionById(id: string): Section | undefined {
  return sections.find((section) => section.id === id);
}

export function getActiveSemestersForBranch(branchId: string): number[] {
  return getSectionsByBranch(branchId).length > 0 ? ACTIVE_SEMESTERS : [];
}

export function isActiveSemester(semester: number): boolean {
  return ACTIVE_SEMESTERS.includes(semester);
}

export function getSubjectsByBranchSemester(
  branchId: string,
  semester: number
): Subject[] {
  const branchSubjects = getBranchBySlug(branchId) ? subjects : [];

  return branchSubjects.filter((subject) => subject.semesterId === semester);
}

export function getSubjectBySlug(slug: string): Subject | undefined {
  return subjects.find((subject) => subject.id === slug);
}

export function getSubjectBySemesterAndId(
  semester: number,
  subjectId: string
): Subject | undefined {
  return subjects.find(
    (subject) => subject.semesterId === semester && subject.id === subjectId
  );
}

export function findSubjectBySlugOrAlias(
  semester: number,
  slugOrAlias: string
): Subject | undefined {
  return subjects.find(
    (subject) =>
      subject.semesterId === semester &&
      (subject.id === slugOrAlias ||
        subject.aliases?.some((alias) => alias === slugOrAlias))
  );
}

/** Display label, e.g. "DSP — Digital Signal Processing". Falls back to the code only when the full form is not defined (EFE). */
export function subjectLabel(subject: Subject): string {
  if (!subject.name) {
    return subject.code;
  }

  return `${subject.code} — ${subject.name}`;
}

/** Canonical name stored on rows (e.g. resources.subject). Falls back to the code only when the full form is not defined (EFE). */
export function subjectName(subject: Subject): string {
  return subject.name || subject.code;
}