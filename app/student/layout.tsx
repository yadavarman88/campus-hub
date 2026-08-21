import { redirect } from "next/navigation";
import { authorizeStudent } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authorization = await authorizeStudent();

  if (!authorization.authorized) {
    if (authorization.status === 401) {
      redirect("/login");
    }

    redirect("/");
  }

  return children;
}
