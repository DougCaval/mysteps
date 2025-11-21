import { useState } from "react";
import { uploadFile } from "../services/storage";
import { createJJCard } from "../services/jjCards";

export default function CreateJJCard({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title) return alert("Título obrigatório");
    setLoading(true);

    // upload
    let image_path = null;
    if (file) {
      const { path, publicUrl, error } = await uploadFile(file, "cards");
      if (error) {
        setLoading(false);
        return alert("Erro upload: " + error);
      }
      image_path = path; // salvamos o path; na hora de ler, montamos a publicUrl
    }

    const { data, error } = await createJJCard({ title, description, image_path });
    setLoading(false);
    if (error) return alert("Erro ao criar card: " + error.message);

    setTitle("");
    setDescription("");
    setFile(null);
    if (onCreated) onCreated(data);
  }

  return (
    <form onSubmit={handleCreate} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
      <h3>Novo golpe (JJ Card)</h3>
      <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Criar Card"}</button>
    </form>
  );
}
