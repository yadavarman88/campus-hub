import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
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

    const { id } = await req.json();

    // Get the resource first
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("created_by, storage_path")
      .eq("id", id)
      .single();

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    if (
      profile.role !== "admin" &&
      (profile.role !== "teacher" || resource.created_by !== user.id)
    ) {
      return NextResponse.json(
        { error: "You are not allowed to delete this resource" },
        { status: 403 }
      );
    }

    // Delete file from Storage
    const { error: storageError } = await supabase.storage
      .from("resources")
      .remove([resource.storage_path]);

    if (storageError) {
      console.error(storageError);

      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // Delete database row
    const { error: dbError } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error(dbError);

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
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}