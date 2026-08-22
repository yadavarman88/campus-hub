import { NextResponse } from "next/server";
import {
  IMPORTANT_QUESTIONS_BUCKET,
  isValidImportantQuestionId,
  isValidSemester,
  SIGNED_URL_EXPIRY_SECONDS,
} from "@/lib/important-questions";
import { authorizeStudent } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const authorization = await authorizeStudent();

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
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("semester")
    .eq("id", authorization.user.id)
    .single();

  if (profileError || !profile) {
    console.error(
      "Student important question download profile lookup error:",
      profileError
    );

    return NextResponse.json(
      { error: "Unable to load your student profile." },
      { status: 500 }
    );
  }

  if (!isValidSemester(profile.semester)) {
    return NextResponse.json(
      { error: "Your student semester is not configured." },
      { status: 422 }
    );
  }

  const { data: importantQuestion, error: lookupError } = await supabase
    .from("important_questions")
    .select("storage_path, original_filename")
    .eq("id", id)
    .eq("semester", profile.semester)
    .maybeSingle();

  if (lookupError) {
    console.error("Student important question download lookup error:", lookupError);

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

  const { data: signedUrl, error: signedUrlError } = await supabase.storage
    .from(IMPORTANT_QUESTIONS_BUCKET)
    .createSignedUrl(
      importantQuestion.storage_path,
      SIGNED_URL_EXPIRY_SECONDS,
      { download: importantQuestion.original_filename }
    );

  if (signedUrlError || !signedUrl?.signedUrl) {
    console.error("Student important question signed URL error:", signedUrlError);

    return NextResponse.json(
      { error: "Unable to create a download link." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    download_url: signedUrl.signedUrl,
    expires_in: SIGNED_URL_EXPIRY_SECONDS,
  });
}
