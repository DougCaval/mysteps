import { supabase } from "../lib/supabaseClient";

/** retorna attendances do usuário (ou de uma classe específica) */
export async function getAttendance(class_id = null) {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  let q = supabase.from("attendance").select("*").eq("user_id", userId);
  if (class_id) q = q.eq("class_id", class_id);

  const { data, error } = await q;
  return { data, error };
}

/** marca presença (ou atualiza) */
export async function upsertAttendance({ class_id, present, note = "" }) {
  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;

  // try update first (based on unique constraint user_id+class_id)
  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("class_id", class_id)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("attendance")
      .update({ present, note })
      .eq("id", existing.id)
      .select()
      .single();

    return { data, error };
  } else {
    const { data, error } = await supabase
      .from("attendance")
      .insert([{ user_id: userId, class_id, present, note }])
      .select()
      .single();

    return { data, error };
  }
}
