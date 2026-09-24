import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  getBranchBySlug,
  getSectionBySlug,
  getSubjectsByBranchSemester,
  isActiveSemester,
  subjectName,
} from "@/lib/academic-data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const authSupabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await authSupabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await authSupabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Admin or teacher access required" },
        { status: 403 }
      );
    }

    if (profile.role !== "teacher" && profile.role !== "admin") {
      return NextResponse.json(
        { error: "Admin or teacher access required" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const branchSlug = formData.get("branch_id") as string;
    const sectionSlug = formData.get("section_id") as string;
    const semester = formData.get("semester") as string;
    const subjectId = formData.get("subject_id") as string;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file selected" },
        { status: 400 }
      );
    }

    const semesterNumber = Number(semester);

    const branch = branchSlug
      ? getBranchBySlug(branchSlug)
      : undefined;
    const section = sectionSlug
      ? getSectionBySlug(sectionSlug)
      : undefined;

    if (!branch) {
      return NextResponse.json(
        { error: "Invalid branch." },
        { status: 400 }
      );
    }

    if (!section || section.branchId !== branch.id) {
      return NextResponse.json(
        { error: "Invalid section for the selected branch." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(semesterNumber) || !isActiveSemester(semesterNumber)) {
      return NextResponse.json(
        { error: "Invalid semester." },
        { status: 400 }
      );
    }

    const subject = getSubjectsByBranchSemester(
      branch.id,
      semesterNumber
    ).find((item) => item.id === subjectId);

    if (!subject) {
      return NextResponse.json(
        { error: "Subject must belong to the selected semester." },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("resources")
      .upload(fileName, file);

    if (storageError) {
      console.error("Storage Error:", storageError);

      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("resources")
      .getPublicUrl(fileName);

    // Insert into database
    const { data, error: dbError } = await supabase
      .from("resources")
      .insert([
        {
          semester: semesterNumber,
          subject: subjectName(subject),
          subject_id: subject.id,
          section_id: section.id,
          category,
          title,
          file_url: publicUrl,
          storage_path: fileName,
          created_by: user.id,
        },
      ])
      .select();

    if (dbError) {
      console.error("Database Error:", dbError);

      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    console.log("Inserted Row:", data);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Upload Error:", err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}