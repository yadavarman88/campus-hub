import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const authorization = await authorizeAdmin();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, semester, subject, subject_id, section_id, category, file_url")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
