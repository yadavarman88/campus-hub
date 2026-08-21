import { NextResponse } from "next/server";
import {
  ANNOUNCEMENT_SELECT_FIELDS,
  isValidAnnouncementId,
  parseAnnouncementBody,
  validateAnnouncementUpdate,
} from "@/lib/announcements";
import { authorizeTeacher } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const { id } = await params;

  if (!isValidAnnouncementId(id)) {
    return NextResponse.json(
      { error: "Invalid announcement ID." },
      { status: 400 }
    );
  }

  const parsedBody = await parseAnnouncementBody(request);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: existingAnnouncement, error: existingError } = await supabase
    .from("announcements")
    .select("title, content, semester, subject_id")
    .eq("id", id)
    .eq("created_by", authorization.user.id)
    .maybeSingle();

  if (existingError) {
    console.error("Teacher announcement lookup error:", existingError);

    return NextResponse.json(
      { error: "Unable to update announcement." },
      { status: 500 }
    );
  }

  if (!existingAnnouncement) {
    return NextResponse.json(
      { error: "Announcement not found." },
      { status: 404 }
    );
  }

  const validation = validateAnnouncementUpdate(
    parsedBody.data,
    existingAnnouncement
  );

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("announcements")
    .update(validation.data)
    .eq("id", id)
    .eq("created_by", authorization.user.id)
    .select(ANNOUNCEMENT_SELECT_FIELDS)
    .maybeSingle();

  if (error) {
    console.error("Teacher announcement update error:", error);

    return NextResponse.json(
      { error: "Unable to update announcement." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Announcement not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ announcement: data });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const { id } = await params;

  if (!isValidAnnouncementId(id)) {
    return NextResponse.json(
      { error: "Invalid announcement ID." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id)
    .eq("created_by", authorization.user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Teacher announcement delete error:", error);

    return NextResponse.json(
      { error: "Unable to delete announcement." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Announcement not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
