import { useState } from "react";
import { updateJJCard } from "../services/jjCards";
import { uploadFile, deleteFile } from "../services/storage";

export default function JJCardItem({ card, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    let image_path = card.image_path;

    if (file) {
      // upload new file
      const { path, publicUrl, error } = await uploadFile(file, "cards");
      if (error) {
        setSaving(false);
        return alert("Erro upload: " + error);
      }
      // delete old file if exists
      if (card.image_path) await deleteFile(card.image_path);
      image_path = path;
    }

    const { data, error } = await updateJJCard(card.id, { title, description, image_path });
    setSaving(false);
    if (error) return alert("Erro ao atualizar: " + error.message);
    setEditing(false);
    // refresh page or parent should refresh; simple approach: reload window (ou emitter)
    window.location.reload();
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {!editing ? (
        <>
          {card.image_url && <img src={card.image_url} alt={card.title} style={{ width: "100%", maxHeight: 250, objectFit: "cover" }} />}
          <h4>{card.title}</h4>
          <p>{card.description}</p>
          <small>{new Date(card.created_at).toLocaleString()}</small>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={onDelete} style={{ marginLeft: 8 }}>Deletar</button>
          </div>
        </>
      ) : (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <div>
            <button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
            <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancelar</button>
          </div>
        </>
      )}
    </div>
  );
}
