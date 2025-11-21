import { supabase } from "../lib/supabaseClient";

export async function getClasses() {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("user_id", userId)
    .order("class_date", { ascending: true });

  return { data, error };
}

export async function createClass({ title, description, class_date, class_time }) {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  const { data, error } = await supabase
    .from("classes")
    .insert([{ user_id: userId, title, description, class_date, class_time }])
    .select()
    .single();

  return { data, error };
}

export async function deleteClass(id) {
  const { data, error } = await supabase
    .from("classes")
    .delete()
    .eq("id", id);
  return { data, error };
}
