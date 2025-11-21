import { supabase } from "../lib/supabaseClient";

/** retorna lista de cards do usuário */
export async function getJJCards() {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  const { data, error } = await supabase
    .from("jj_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function createJJCard({ title, description, image_path }) {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  const { data, error } = await supabase
    .from("jj_cards")
    .insert([{ user_id: userId, title, description, image_path }])
    .select()
    .single();

  return { data, error };
}

export async function updateJJCard(id, { title, description, image_path }) {
  const { data, error } = await supabase
    .from("jj_cards")
    .update({ title, description, image_path })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteJJCard(id) {
  const { data, error } = await supabase
    .from("jj_cards")
    .delete()
    .eq("id", id);

  return { data, error };
}
