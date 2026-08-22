import { getSubjectsBySemester } from "@/lib/subjects";

export const IMPORTANT_QUESTIONS_BUCKET = "important-questions";
export const SIGNED_URL_EXPIRY_SECONDS = 60;
export const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const TEACHER_IMPORTANT_QUESTION_SELECT_FIELDS =
  "id, title, semester, subject_id, unit_number, original_filename, mime_type, file_size_bytes, created_at, updated_at";

export const STUDENT_IMPORTANT_QUESTION_SELECT_FIELDS =
  "id, title, semester, subject_id, unit_number, original_filename, mime_type, file_size_bytes, created_at";

type FileDetails = {
  extension: "pdf" | "jpg" | "png" | "webp";
  mimeType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
  maxSizeBytes: number;
};

export type ImportantQuestionUpload = {
  title: string;
  semester: number;
  subjectId: string;
  unitNumber: number;
  file: File;
  originalFilename: string;
  fileDetails: FileDetails;
};

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

function isSupportedHeader(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function getFileDetails(bytes: Uint8Array): FileDetails | null {
  if (isSupportedHeader(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return {
      extension: "pdf",
      mimeType: "application/pdf",
      maxSizeBytes: MAX_PDF_SIZE_BYTES,
    };
  }

  if (isSupportedHeader(bytes, [0xff, 0xd8, 0xff])) {
    return {
      extension: "jpg",
      mimeType: "image/jpeg",
      maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    };
  }

  if (isSupportedHeader(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return {
      extension: "png",
      mimeType: "image/png",
      maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    };
  }

  if (
    isSupportedHeader(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    isSupportedHeader(bytes.slice(8), [0x57, 0x45, 0x42, 0x50])
  ) {
    return {
      extension: "webp",
      mimeType: "image/webp",
      maxSizeBytes: MAX_IMAGE_SIZE_BYTES,
    };
  }

  return null;
}

function getSingleString(formData: FormData, key: string) {
  const values = formData.getAll(key);

  if (values.length !== 1 || typeof values[0] !== "string") {
    return null;
  }

  return values[0].trim();
}

function getSingleFile(formData: FormData) {
  const values = formData.getAll("file");

  if (values.length !== 1 || !(values[0] instanceof File)) {
    return null;
  }

  return values[0];
}

function parseInteger(value: string, minimum: number, maximum: number) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
}

function normalizeFilename(filename: string, extension: FileDetails["extension"]) {
  const basename = filename.split(/[\\/]/).pop() ?? "";
  const withoutExtension = basename.replace(/\.[^.]*$/, "");
  const safeBase = withoutExtension
    .replace(/[^a-zA-Z0-9() _-]/g, "_")
    .trim()
    .slice(0, 200);

  return `${safeBase || "important-question"}.${extension}`;
}

export function isValidImportantQuestionId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export function isValidSemester(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 8
  );
}

export function parseUnitNumber(value: string) {
  return parseInteger(value, 1, 20);
}

export async function validateImportantQuestionUpload(
  formData: FormData
): Promise<ValidationResult<ImportantQuestionUpload>> {
  const allowedFields = new Set([
    "title",
    "semester",
    "subject_id",
    "unit_number",
    "file",
  ]);

  for (const key of formData.keys()) {
    if (!allowedFields.has(key)) {
      return {
        success: false,
        error: `Field "${key}" is not allowed.`,
      };
    }
  }

  const title = getSingleString(formData, "title");
  const semesterValue = getSingleString(formData, "semester");
  const subjectId = getSingleString(formData, "subject_id");
  const unitValue = getSingleString(formData, "unit_number");
  const file = getSingleFile(formData);

  if (!title || title.length > 160) {
    return {
      success: false,
      error: "Title must be between 1 and 160 characters.",
    };
  }

  const semester = semesterValue ? parseInteger(semesterValue, 1, 8) : null;

  if (!semester) {
    return {
      success: false,
      error: "Semester must be an integer between 1 and 8.",
    };
  }

  if (
    !subjectId ||
    !getSubjectsBySemester(semester).some(
      (subject) => subject.id === subjectId
    )
  ) {
    return {
      success: false,
      error: "Subject must belong to the selected semester.",
    };
  }

  const unitNumber = unitValue ? parseUnitNumber(unitValue) : null;

  if (!unitNumber) {
    return {
      success: false,
      error: "Unit must be an integer between 1 and 20.",
    };
  }

  if (!file || file.size === 0 || file.size > MAX_PDF_SIZE_BYTES) {
    return {
      success: false,
      error: "Choose a PDF or image file up to 20 MB.",
    };
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const fileDetails = getFileDetails(header);

  if (!fileDetails) {
    return {
      success: false,
      error: "Only PDF, JPEG, PNG, and WebP files are allowed.",
    };
  }

  if (file.size > fileDetails.maxSizeBytes) {
    return {
      success: false,
      error: "Image files must be 10 MB or smaller.",
    };
  }

  return {
    success: true,
    data: {
      title,
      semester,
      subjectId,
      unitNumber,
      file,
      originalFilename: normalizeFilename(file.name, fileDetails.extension),
      fileDetails,
    },
  };
}
