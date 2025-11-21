export default function JJCard({ card }) {
  return (
    <div className="card">
      <img src={card.image_url} width="100%" />
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <small>Criado em: {new Date(card.created_at).toLocaleDateString()}</small>
    </div>
  );
}
