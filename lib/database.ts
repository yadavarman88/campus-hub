import { supabase } from "./supabase";

export async function getResources(
  semester: number,
  subject: string,
  category: string
) {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("semester", semester)
    .ilike("subject", subject.trim())
    .eq("category", category.trim())
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}