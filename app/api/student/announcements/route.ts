import { NextResponse } from "next/server";
import { ANNOUNCEMENT_SELECT_FIELDS } from "@/lib/announcements";
import { authorizeStudent } from "@/lib/auth";
import { getSubjectsBySemester } from "@/lib/subjects";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Announcement = {
  id: string;
  title: string;
  content: string;
  semester: number | null;
  subject_id: string | null;
  created_at: string;
  updated_at: string;
};

function isValidSemester(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 8
  );
}

export async function GET() {
  const authorization = await authorizeStudent();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("semester")
    .eq("id", authorization.user.id)
    .single();

  if (profileError || !profile) {
    console.error("Student announcement profile lookup error:", profileError);

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
  const enrolledSubjectIds = new Set(
    getSubjectsBySemester(studentSemester).map((subject) => subject.id)
  );
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_SELECT_FIELDS)
    .or(`semester.is.null,semester.eq.${studentSemester}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Student announcement list error:", error);

    return NextResponse.json(
      { error: "Unable to fetch announcements." },
      { status: 500 }
    );
  }

  const announcements = ((data ?? []) as Announcement[]).filter(
    (announcement) => {
      const isCampusWide =
        announcement.semester === null && announcement.subject_id === null;
      const isSemesterAnnouncement =
        announcement.semester === studentSemester &&
        announcement.subject_id === null;
      const isSubjectAnnouncement =
        announcement.semester === studentSemester &&
        announcement.subject_id !== null &&
        enrolledSubjectIds.has(announcement.subject_id);

      return isCampusWide || isSemesterAnnouncement || isSubjectAnnouncement;
    }
  );

  return NextResponse.json({ announcements });
}
