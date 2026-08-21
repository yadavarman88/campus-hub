import { NextResponse } from "next/server";
import {
  ANNOUNCEMENT_SELECT_FIELDS,
  parseAnnouncementBody,
  validateAnnouncementCreate,
} from "@/lib/announcements";
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
    .from("announcements")
    .select(ANNOUNCEMENT_SELECT_FIELDS)
    .eq("created_by", authorization.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Teacher announcement list error:", error);

    return NextResponse.json(
      { error: "Unable to fetch announcements." },
      { status: 500 }
    );
  }

  return NextResponse.json({ announcements: data ?? [] });
}

export async function POST(request: Request) {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const parsedBody = await parseAnnouncementBody(request);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error },
      { status: 400 }
    );
  }

  const validation = validateAnnouncementCreate(parsedBody.data);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      ...validation.data,
      created_by: authorization.user.id,
    })
    .select(ANNOUNCEMENT_SELECT_FIELDS)
    .single();

  if (error || !data) {
    console.error("Teacher announcement create error:", error);

    return NextResponse.json(
      { error: "Unable to create announcement." },
      { status: 500 }
    );
  }

  return NextResponse.json({ announcement: data }, { status: 201 });
}
