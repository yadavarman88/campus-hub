import { NextResponse } from "next/server";
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
    .from("resources")
    .select("id, title, semester, subject, category, file_url")
    .eq("created_by", authorization.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
