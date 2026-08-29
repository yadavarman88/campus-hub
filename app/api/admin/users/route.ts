import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const allowedRoles = ["student", "teacher", "admin"] as const;

type AllowedRole = (typeof allowedRoles)[number];

function isAllowedRole(value: unknown): value is AllowedRole {
  return (
    typeof value === "string" &&
    allowedRoles.includes(value as AllowedRole)
  );
}

export async function GET() {
  const authorization = await authorizeAdmin();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, department, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load profiles:", error);

    return NextResponse.json(
      { error: "Unable to load users." },
      { status: 500 }
    );
  }

  return NextResponse.json({ users: profiles ?? [] });
}

export async function PATCH(request: Request) {
  const authorization = await authorizeAdmin();

  if (!authorization.authorized) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("id" in body) ||
    !("role" in body)
  ) {
    return NextResponse.json(
      { error: "User ID and role are required." },
      { status: 400 }
    );
  }

  const { id, role } = body as {
    id: unknown;
    role: unknown;
  };

  if (typeof id !== "string" || !id) {
    return NextResponse.json(
      { error: "Invalid user ID." },
      { status: 400 }
    );
  }

  if (!isAllowedRole(role)) {
    return NextResponse.json(
      { error: "Invalid role." },
      { status: 400 }
    );
  }

  // Prevent the currently logged-in admin from removing
  // their own admin access.
  if (id === authorization.user.id && role !== "admin") {
    return NextResponse.json(
      { error: "You cannot remove your own admin access." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select("id, full_name, role, department, created_at")
    .single();

  if (error) {
    console.error("Failed to update profile:", error);

    return NextResponse.json(
      { error: "Unable to update user role." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: updatedProfile,
  });
}
