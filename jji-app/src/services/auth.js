import { supabase } from "../lib/supabaseClient";

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password });
}

export async function resetPassword(email) {
  return await supabase.auth.resetPasswordForEmail(email);
}

export async function signOut() {
  return await supabase.auth.signOut();
}
