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
