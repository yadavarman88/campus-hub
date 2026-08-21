import { subjects } from "@/lib/subjects";

export const ANNOUNCEMENT_SELECT_FIELDS =
  "id, title, content, semester, subject_id, created_at, updated_at";

const ALLOWED_MUTATION_FIELDS = [
  "title",
  "content",
  "semester",
  "subject_id",
] as const;

type AnnouncementMutationField =
  (typeof ALLOWED_MUTATION_FIELDS)[number];

type AnnouncementTarget = {
  semester: number | null;
  subject_id: string | null;
};

export type AnnouncementInput = AnnouncementTarget & {
  title: string;
  content: string;
};

export type Announcement = AnnouncementInput & {
  id: string;
  created_at: string;
  updated_at: string;
};

type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export type ValidationResult<T> =
  | ValidationSuccess<T>
  | ValidationFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwn(
  value: Record<string, unknown>,
  key: AnnouncementMutationField
) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function validateMutationObject(
  value: unknown
): ValidationResult<Record<string, unknown>> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "Request body must be a JSON object.",
    };
  }

  const unknownField = Object.keys(value).find(
    (field) =>
      !ALLOWED_MUTATION_FIELDS.includes(
        field as AnnouncementMutationField
      )
  );

  if (unknownField) {
    return {
      success: false,
      error: `Field \"${unknownField}\" is not allowed.`,
    };
  }

  return {
    success: true,
    data: value,
  };
}

function validateAnnouncementState(
  titleValue: unknown,
  contentValue: unknown,
  semesterValue: unknown,
  subjectIdValue: unknown
): ValidationResult<AnnouncementInput> {
  if (typeof titleValue !== "string") {
    return {
      success: false,
      error: "Title must be a string.",
    };
  }

  const title = titleValue.trim();

  if (title.length < 1 || title.length > 160) {
    return {
      success: false,
      error: "Title must be between 1 and 160 characters.",
    };
  }

  if (typeof contentValue !== "string") {
    return {
      success: false,
      error: "Content must be a string.",
    };
  }

  const content = contentValue.trim();

  if (content.length < 1 || content.length > 10000) {
    return {
      success: false,
      error: "Content must be between 1 and 10000 characters.",
    };
  }

  let semester: number | null;

  if (semesterValue === null) {
    semester = null;
  } else if (
    typeof semesterValue === "number" &&
    Number.isInteger(semesterValue) &&
    semesterValue >= 1 &&
    semesterValue <= 8
  ) {
    semester = semesterValue;
  } else {
    return {
      success: false,
      error: "Semester must be null or an integer between 1 and 8.",
    };
  }

  let subjectId: string | null;

  if (subjectIdValue === null) {
    subjectId = null;
  } else if (typeof subjectIdValue === "string") {
    subjectId = subjectIdValue.trim();

    if (!subjectId) {
      return {
        success: false,
        error: "Subject ID must be a non-empty string or null.",
      };
    }
  } else {
    return {
      success: false,
      error: "Subject ID must be a non-empty string or null.",
    };
  }

  if (subjectId && semester === null) {
    return {
      success: false,
      error: "Subject ID requires a semester.",
    };
  }

  if (
    subjectId &&
    !subjects.some(
      (subject) =>
        subject.id === subjectId && subject.semesterId === semester
    )
  ) {
    return {
      success: false,
      error: "Subject ID does not belong to the selected semester.",
    };
  }

  return {
    success: true,
    data: {
      title,
      content,
      semester,
      subject_id: subjectId,
    },
  };
}

export function validateAnnouncementCreate(
  value: unknown
): ValidationResult<AnnouncementInput> {
  const mutationObject = validateMutationObject(value);

  if (!mutationObject.success) {
    return mutationObject;
  }

  const body = mutationObject.data;

  return validateAnnouncementState(
    body.title,
    body.content,
    hasOwn(body, "semester") ? body.semester : null,
    hasOwn(body, "subject_id") ? body.subject_id : null
  );
}

export function validateAnnouncementUpdate(
  value: unknown,
  current: AnnouncementInput
): ValidationResult<AnnouncementInput> {
  const mutationObject = validateMutationObject(value);

  if (!mutationObject.success) {
    return mutationObject;
  }

  const body = mutationObject.data;

  if (Object.keys(body).length === 0) {
    return {
      success: false,
      error: "At least one announcement field is required.",
    };
  }

  return validateAnnouncementState(
    hasOwn(body, "title") ? body.title : current.title,
    hasOwn(body, "content") ? body.content : current.content,
    hasOwn(body, "semester") ? body.semester : current.semester,
    hasOwn(body, "subject_id")
      ? body.subject_id
      : current.subject_id
  );
}

export function isValidAnnouncementId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function parseAnnouncementBody(
  request: Request
): Promise<ValidationResult<unknown>> {
  try {
    return {
      success: true,
      data: await request.json(),
    };
  } catch {
    return {
      success: false,
      error: "Request body must contain valid JSON.",
    };
  }
}
