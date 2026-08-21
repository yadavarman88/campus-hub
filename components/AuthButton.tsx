"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type AuthButtonProps = {
  variant?: "public" | "admin";
};

const supabase = createSupabaseBrowserClient();

export default function AuthButton({
  variant = "public",
}: AuthButtonProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (active) {
        setUser(currentUser);
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return <div className="h-9 w-20" aria-hidden="true" />;
  }

  const className =
    variant === "admin"
      ? "rounded-full border border-gray-700 bg-[#171A21] px-4 py-2 text-sm text-gray-300 transition hover:border-gray-500 hover:text-white"
      : "rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800";

  return user ? (
    <button type="button" onClick={handleLogout} className={className}>
      Logout
    </button>
  ) : (
    <button
      type="button"
      onClick={() => router.push("/login")}
      className={className}
    >
      Login
    </button>
  );
}
