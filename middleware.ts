import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isDashboardRoute =
    pathname.startsWith("/student") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/admin");

  if (!isDashboardRoute) {
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const roleRoutes = {
    student: "/student",
    teacher: "/teacher",
    admin: "/admin",
  } as const;

  const allowedRoute = roleRoutes[profile.role as keyof typeof roleRoutes];

  if (!allowedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const hasAccess =
    (profile.role === "student" && pathname.startsWith("/student")) ||
    (profile.role === "teacher" && pathname.startsWith("/teacher")) ||
    (profile.role === "admin" && pathname.startsWith("/admin"));

  if (!hasAccess) {
    return NextResponse.redirect(new URL(allowedRoute, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*"],
};
