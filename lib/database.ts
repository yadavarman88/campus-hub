import { supabase } from "./supabase";

export async function getResources() {
  const response = await supabase
    .from("resources")
    .select("*");

  console.log("SUPABASE RESPONSE:");
  console.dir(response, { depth: null });

  return response.data ?? [];
}