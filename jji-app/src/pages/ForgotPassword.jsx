import { useState } from "react";
import { resetPassword } from "../services/auth";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRecovery(e) {
    e.preventDefault();
    await resetPassword(email);
    setMsg("Enviado! Verifique seu e-mail.");
  }

  return (
    <div className="container">
      <h1>Recuperar Senha</h1>

      <form onSubmit={handleRecovery}>
        <input type="email" placeholder="Seu e-mail"
          onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Enviar</button>
      </form>

      {msg && <p>{msg}</p>}

      <Link to="/login">Voltar</Link>
    </div>
  );
}
