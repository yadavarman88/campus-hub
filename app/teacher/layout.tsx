import { redirect } from "next/navigation";
import { authorizeTeacher } from "@/lib/auth";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authorization = await authorizeTeacher();

  if (!authorization.authorized) {
    if (authorization.status === 401) {
      redirect("/login");
    }

    redirect("/");
  }

  return children;
}
