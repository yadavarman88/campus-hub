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

// Explore lookup is driven by the canonical subject_id. Section scoping shows
// shared resources (section_id NULL) plus any resources for the chosen
// section; section ownership is never guessed for existing rows.
export async function getResourcesForExplore(
  semester: number,
  subjectId: string,
  sectionId: string,
  category: string
) {
  const query = supabase
    .from("resources")
    .select("*")
    .eq("semester", semester)
    .eq("subject_id", subjectId)
    .eq("category", category)
    .or(`section_id.is.null,section_id.eq.${sectionId}`)
    .order("created_at", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}