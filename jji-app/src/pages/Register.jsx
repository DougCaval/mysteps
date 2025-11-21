import { useState } from "react";
import { signUp } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const { error } = await signUp(email, password);
    if (error) return setError(error.message);
    alert("Conta criada! Verifique seu e-mail.");
    navigate("/login");
  }

  return (
    <div className="container">
      <h1>Criar Conta</h1>

      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Criar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Link to="/login">Voltar</Link>
    </div>
  );
}
