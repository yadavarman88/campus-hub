export interface Semester {
  id: number;
  label: string;
  title: string;
  subjectCount: number;
}

export interface Upload {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  type: string;
  uploadedAgo: string;
}

export interface Subject {
  id: string;
  semesterId: number;
  code: string;
  name: string;
  /** Legacy slugs that used to identify this subject (e.g. "digital-communication"). */
  aliases?: string[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  slug: string;
}

export interface Section {
  id: string;
  branchId: string;
  name: string;
  slug: string;
}

export interface Resource {
  id: string;
  semesterId: number;
  subjectId: string;
  category: string;
  title: string;
  file: string;
  type: "PDF";
}