import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Get the resource first
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
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