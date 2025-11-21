import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    full_name: "",
    weight_kg: "",
    belt: "",
    degrees: 0,
  });

  const user = supabase.auth.getUser();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.data.user.id)
        .single();
      if (data) setProfile(data);
    }
    load();
  }, []);

  async function saveProfile() {
    await supabase.from("profiles")
      .update(profile)
      .eq("id", user.data.user.id);
    alert("Salvo!");
  }

  return (
    <div>
      <h2>Perfil do Atleta</h2>

      <input type="text" placeholder="Nome completo"
        value={profile.full_name}
        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />

      <input type="number" placeholder="Peso (kg)"
        value={profile.weight_kg}
        onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value })} />

      <select
        value={profile.belt}
        onChange={(e) => setProfile({ ...profile, belt: e.target.value })}
      >
        <option value="">Selecione a faixa</option>
        <option value="branca">Branca</option>
        <option value="azul">Azul</option>
        <option value="roxa">Roxa</option>
        <option value="marrom">Marrom</option>
        <option value="preta">Preta</option>
      </select>

      <select
        value={profile.degrees}
        onChange={(e) => setProfile({ ...profile, degrees: e.target.value })}
      >
        <option value="0">0 graus</option>
        <option value="1">1 grau</option>
        <option value="2">2 graus</option>
        <option value="3">3 graus</option>
        <option value="4">4 graus</option>
      </select>

      <button onClick={saveProfile}>Salvar</button>
    </div>
  );
}
