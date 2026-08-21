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

    console.log("Login started");

    setLoading(true);
    setMessage("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("Data:", data);
      console.log("Error:", error);

      if (error) {
        setMessage(error.message);
        return;
      }

      const user = data.user ?? data.session?.user;

      if (!user) {
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
        setMessage("Unable to verify your account profile. Please try again.");
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
        setMessage("Your account has an invalid role. Please contact an administrator.");
        return;
      }

      alert("Login successful!");

      const roleRoutes = {
        student: "/student",
        teacher: "/teacher",
        admin: "/admin",
      } as const;

      router.push(roleRoutes[role]);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0F17] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2F3A] bg-[#171A21] p-8">
        <h1 className="text-3xl font-bold text-white">
          Campus Hub
        </h1>

        <p className="mt-2 text-gray-400">
          Sign in to access the admin dashboard.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#2A2F3A] bg-[#0B0F17] p-3 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {message && (
            <p className="text-center text-red-400">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
