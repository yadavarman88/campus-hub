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