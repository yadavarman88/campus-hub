import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const semester = formData.get("semester") as string;
    const subject = formData.get("subject") as string;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file selected" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error: storageError } = await supabase.storage
      .from("resources")
      .upload(fileName, file);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("resources")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("resources")
      .insert({
        semester: Number(semester),
        subject,
        category,
        title,
        file_url: publicUrl,
      });

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}