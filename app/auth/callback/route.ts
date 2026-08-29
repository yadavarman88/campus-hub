import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=oauth", requestUrl.origin)
    );
  }

  const supabase = await createSupabaseServerClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback error:", error);

    return NextResponse.redirect(
      new URL("/login?error=oauth", requestUrl.origin)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=oauth", requestUrl.origin)
    );
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.redirect(
      new URL("/login?error=no_profile", requestUrl.origin)
    );
  }

  const roleRoutes = {
    student: "/student",
    teacher: "/teacher",
    admin: "/admin",
  } as const;

  const role = profile.role as keyof typeof roleRoutes;

  if (!(role in roleRoutes)) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_role", requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL(roleRoutes[role], requestUrl.origin)
  );
}