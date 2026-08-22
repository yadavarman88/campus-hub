import { NextResponse } from "next/server";
import {
  IMPORTANT_QUESTIONS_BUCKET,
  TEACHER_IMPORTANT_QUESTION_SELECT_FIELDS,
  validateImportantQuestionUpload,
} from "@/lib/important-questions";
import { authorizeTeacher } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("important_questions")
    .select(TEACHER_IMPORTANT_QUESTION_SELECT_FIELDS)
    .eq("created_by", authorization.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Teacher important question list error:", error);

    return NextResponse.json(
      { error: "Unable to fetch important questions." },
      { status: 500 }
    );
  }

  return NextResponse.json({ important_questions: data ?? [] });
}

export async function POST(request: Request) {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Request body must contain valid multipart form data." },
      { status: 400 }
    );
  }

  let validation;

  try {
    validation = await validateImportantQuestionUpload(formData);
  } catch {
    return NextResponse.json(
      { error: "Unable to read the uploaded file." },
      { status: 400 }
    );
  }

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const { data: upload } = validation;
  const storagePath = `${authorization.user.id}/${upload.semester}/${upload.subjectId}/unit-${upload.unitNumber}-${crypto.randomUUID()}.${upload.fileDetails.extension}`;
  const supabase = await createSupabaseServerClient();
  const { error: storageError } = await supabase.storage
    .from(IMPORTANT_QUESTIONS_BUCKET)
    .upload(storagePath, upload.file, {
      contentType: upload.fileDetails.mimeType,
      upsert: false,
    });

  if (storageError) {
    console.error("Teacher important question storage upload error:", storageError);

    return NextResponse.json(
      { error: "Unable to upload the important question file." },
      { status: 500 }
    );
  }

  const { data, error: databaseError } = await supabase
    .from("important_questions")
    .insert({
      title: upload.title,
      semester: upload.semester,
      subject_id: upload.subjectId,
      unit_number: upload.unitNumber,
      storage_path: storagePath,
      original_filename: upload.originalFilename,
      mime_type: upload.fileDetails.mimeType,
      file_size_bytes: upload.file.size,
      created_by: authorization.user.id,
    })
    .select(TEACHER_IMPORTANT_QUESTION_SELECT_FIELDS)
    .single();

  if (databaseError || !data) {
    console.error("Teacher important question database insert error:", databaseError);

    const { error: cleanupError } = await supabase.storage
      .from(IMPORTANT_QUESTIONS_BUCKET)
      .remove([storagePath]);

    if (cleanupError) {
      console.error("Teacher important question upload cleanup error:", cleanupError);
    }

    return NextResponse.json(
      { error: "Unable to save the important question upload." },
      { status: 500 }
    );
  }

  return NextResponse.json({ important_question: data }, { status: 201 });
}
