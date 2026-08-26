"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage(error.message);
        return;
      }

      const user = data.user ?? data.session?.user;

      if (!user) {
        setMessage("Unable to determine the authenticated user.");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
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
        setMessage(
          "No profile was found for this account. Please contact an administrator."
        );
        return;
      }

      const role = profile.role as string;

      if (
        role !== "student" &&
        role !== "teacher" &&
        role !== "admin"
      ) {
        setMessage(
          "Your account has an invalid role. Please contact an administrator."
        );
        return;
      }

      const roleRoutes = {
        student: "/student",
        teacher: "/teacher",
        admin: "/admin",
      } as const;

      router.push(roleRoutes[role]);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B12] px-5">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/[0.05] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.12)]">
            <span className="text-xl font-bold text-blue-300">
              C
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Campus Hub
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            IPU Resource Portal
          </p>
        </div>

        {/* Login card */}
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

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
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
                disabled={loading}
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
                disabled={loading}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-blue-400/20 focus:border-blue-400/40 focus:bg-blue-500/[0.04] focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
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