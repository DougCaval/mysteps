import { supabase } from "../lib/supabaseClient";

/**
 * Faz upload do arquivo para o bucket 'jj-uploads' (crie esse bucket no Supabase)
 * retorna { path, publicUrl, error }
 */
export async function uploadFile(file, folder = "cards") {
  if (!file) return { error: "No file provided" };

  const user = await supabase.auth.getUser();
  const userId = user.data.user.id;
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${folder}/${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("jj-uploads")
    .upload(path, file, { upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { publicUrl } = supabase.storage.from("jj-uploads").getPublicUrl(path);
  return { path, publicUrl, error: null };
}

export async function deleteFile(path) {
  if (!path) return { error: "no path" };
  const { error } = await supabase.storage.from("jj-uploads").remove([path]);
  return { error };
}
