import { NextResponse } from "next/server";
import {
  isValidSemester,
  parseUnitNumber,
  STUDENT_IMPORTANT_QUESTION_SELECT_FIELDS,
} from "@/lib/important-questions";
import { authorizeStudent } from "@/lib/auth";
import { getSubjectsBySemester } from "@/lib/subjects";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const authorization = await authorizeStudent();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const allowedFilters = new Set(["subject_id", "unit"]);

  for (const filter of searchParams.keys()) {
    if (!allowedFilters.has(filter)) {
      return NextResponse.json(
        { error: `Filter "${filter}" is not allowed.` },
        { status: 400 }
      );
    }
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("semester")
    .eq("id", authorization.user.id)
    .single();

  if (profileError || !profile) {
    console.error("Student important question profile lookup error:", profileError);

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

  const studentSemester = profile.semester;
  const subjectId = searchParams.get("subject_id");
  const unitValue = searchParams.get("unit");

  if (
    subjectId !== null &&
    !getSubjectsBySemester(studentSemester).some(
      (subject) => subject.id === subjectId
    )
  ) {
    return NextResponse.json(
      { error: "Subject filter must belong to your semester." },
      { status: 400 }
    );
  }

  const unitNumber = unitValue === null ? null : parseUnitNumber(unitValue);

  if (unitValue !== null && !unitNumber) {
    return NextResponse.json(
      { error: "Unit filter must be an integer between 1 and 20." },
      { status: 400 }
    );
  }

  let query = supabase
    .from("important_questions")
    .select(STUDENT_IMPORTANT_QUESTION_SELECT_FIELDS)
    .eq("semester", studentSemester)
    .order("created_at", { ascending: false });

  if (subjectId !== null) {
    query = query.eq("subject_id", subjectId);
  }

  if (unitNumber !== null) {
    query = query.eq("unit_number", unitNumber);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Student important question list error:", error);

    return NextResponse.json(
      { error: "Unable to fetch important questions." },
      { status: 500 }
    );
  }

  return NextResponse.json({ important_questions: data ?? [] });
}
