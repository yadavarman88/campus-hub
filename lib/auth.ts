import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase-server";

type AuthorizationFailure = {
  authorized: false;
  status: 401 | 403;
  error: string;
};

type AuthorizationSuccess = {
  authorized: true;
  user: User;
  role: string;
};

export type TeacherAuthorization =
  | AuthorizationFailure
  | (AuthorizationSuccess & {
      profile: {
        role: string;
      };
    });

export type StudentAuthorization =
  | AuthorizationFailure
  | (AuthorizationSuccess & {
      profile: {
        role: string;
      };
    });

export type AdminAuthorization =
  | AuthorizationFailure
  | AuthorizationSuccess;

export async function authorizeAdmin(): Promise<AdminAuthorization> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return {
      authorized: false,
      status: 403,
      error: "Admin access required",
    };
  }

  return {
    authorized: true,
    user,
    role: profile.role,
  };
}

export async function authorizeTeacher(): Promise<TeacherAuthorization> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "teacher") {
    return {
      authorized: false,
      status: 403,
      error: "Teacher access required",
    };
  }

  return {
    authorized: true,
    user,
    role: profile.role,
    profile,
  };
}

export async function authorizeStudent(): Promise<StudentAuthorization> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "student") {
    return {
      authorized: false,
      status: 403,
      error: "Student access required",
    };
  }

  return {
    authorized: true,
    user,
    role: profile.role,
    profile,
  };
}
