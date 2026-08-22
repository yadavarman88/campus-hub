import { NextResponse } from "next/server";
import {
  IMPORTANT_QUESTIONS_BUCKET,
  isValidImportantQuestionId,
} from "@/lib/important-questions";
import { authorizeTeacher } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const { id } = await params;

  if (!isValidImportantQuestionId(id)) {
    return NextResponse.json(
      { error: "Invalid important question ID." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: importantQuestion, error: lookupError } = await supabase
    .from("important_questions")
    .select("id, storage_path")
    .eq("id", id)
    .eq("created_by", authorization.user.id)
    .maybeSingle();

  if (lookupError) {
    console.error("Teacher important question delete lookup error:", lookupError);

    return NextResponse.json(
      { error: "Unable to find the important question." },
      { status: 500 }
    );
  }

  if (!importantQuestion) {
    return NextResponse.json(
      { error: "Important question not found." },
      { status: 404 }
    );
  }

  const { error: storageError } = await supabase.storage
    .from(IMPORTANT_QUESTIONS_BUCKET)
    .remove([importantQuestion.storage_path]);

  if (storageError) {
    console.error("Teacher important question storage delete error:", storageError);

    return NextResponse.json(
      { error: "Unable to delete the important question file." },
      { status: 500 }
    );
  }

  const { data: deletedQuestion, error: deleteError } = await supabase
    .from("important_questions")
    .delete()
    .eq("id", id)
    .eq("created_by", authorization.user.id)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    console.error("Teacher important question database delete error:", deleteError);

    return NextResponse.json(
      {
        error:
          "The file was deleted, but the important question record could not be removed.",
      },
      { status: 500 }
    );
  }

  if (!deletedQuestion) {
    return NextResponse.json(
      {
        error:
          "The file was deleted, but the important question record no longer exists.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
