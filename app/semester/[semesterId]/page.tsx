"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Role = "student" | "teacher" | "admin";

const roleRoutes: Record<Role, string> = {
  student: "/student",
  teacher: "/teacher",
  admin: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function redirectUserByRole() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Unable to determine the authenticated user.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      setMessage(
        "Unable to verify your account profile. Please try again."
      );
      return;
    }

    if (!profile) {
      await supabase.auth.signOut();

      setMessage(
        "No profile was found for this account. Please contact an administrator."
      );
      return;
    }

    const role = profile.role as Role;

    if (!(role in roleRoutes)) {
      await supabase.auth.signOut();

      setMessage(
        "Your account has an invalid role. Please contact an administrator."
      );
      return;
    }

    router.replace(roleRoutes[role]);
  }

  useEffect(() => {
    async function handleOAuthReturn() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      setGoogleLoading(true);
      setMessage("");

      await redirectUserByRole();

      setGoogleLoading(false);
    }

    handleOAuthReturn();
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      await redirectUserByRole();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setMessage(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Unable to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  }

  const isLoading = loading || googleLoading;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B12] px-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/[0.05] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.12)]">
            <span className="text-xl font-bold text-blue-300">C</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Campus Hub
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            IPU Resource Portal
          </p>
        </div>

        <div className="rounded-3xl border border-blue-400/[0.12] bg-white/[0.025] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Secure Access
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Sign in
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in with your Campus Hub account to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-blue-400/30 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path
                fill="currentColor"
                d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
              />
              <path
                fill="currentColor"
                d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.5A9.74 9.74 0 0 0 12 21.6Z"
              />
              <path
                fill="currentColor"
                d="M6.53 13.71A5.85 5.85 0 0 1 6.23 12c0-.59.1-1.17.3-1.71v-2.5H3.29A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.21l3.24-2.5Z"
              />
              <path
                fill="currentColor"
                d="M12 6.26c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.39l3.24 2.5C7.3 7.98 9.46 6.26 12 6.26Z"
              />
            </svg>

            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-xs uppercase tracking-wider text-gray-600">
              or
            </span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Email
              </label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-blue-400/20 focus:border-blue-400/40 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Password
              </label>

              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-blue-400/20 focus:border-blue-400/40 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(37,99,235,0.18)] transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_10px_35px_rgba(37,99,235,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {message && (
              <div className="rounded-xl border border-red-400/15 bg-red-500/[0.05] px-4 py-3">
                <p className="text-center text-sm text-red-400">
                  {message}
                </p>
              </div>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Access is controlled by your Campus Hub account role.
        </p>
      </div>
    </main>
  );
}