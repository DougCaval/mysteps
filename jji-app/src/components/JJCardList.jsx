import { useEffect, useState } from "react";
import { getJJCards, deleteJJCard } from "../services/jjCards";
import { supabase } from "../lib/supabaseClient";
import JJCardItem from "./JJCardItem";

export default function JJCardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await getJJCards();
    setLoading(false);
    if (error) return alert("Erro ao carregar cards: " + error.message);
    // map to include image_url if image_path present
    const mapped = data.map(c => {
      if (c.image_path) {
        const { publicUrl } = supabase.storage.from("jj-uploads").getPublicUrl(c.image_path);
        return { ...c, image_url: publicUrl };
      }
      return c;
    });
    setCards(mapped);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, path) {
    if (!confirm("Deletar esse card?")) return;
    const { error } = await deleteJJCard(id);
    if (error) return alert("Erro ao deletar: " + error.message);
    // delete file from storage (optional)
    if (path) {
      await supabase.storage.from("jj-uploads").remove([path]);
    }
    load();
  }

  return (
    <div>
      <h3>Meus JJ Cards</h3>
      {loading && <p>Carregando...</p>}
      {cards.length === 0 && !loading && <p>Nenhum card criado.</p>}
      {cards.map(c => (
        <JJCardItem key={c.id} card={c} onDelete={() => handleDelete(c.id, c.image_path)} />
      ))}
    </div>
  );
}
