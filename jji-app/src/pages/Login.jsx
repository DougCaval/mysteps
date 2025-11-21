import { useState } from "react";
import { signIn } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await signIn(email, password);
    if (error) return setError(error.message);
    // esperar sessão criada
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      // opcional: criar profile vazio se não existir
      // redireciona
      navigate("/dashboard");
    } else {
      setError("Não foi possível iniciar sessão");
    }
  }

  return (
    <div className="container">
      <h1>Entrar</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/register">Criar conta</Link><br />
      <Link to="/forgot">Esqueci minha senha</Link>
    </div>
  );
}
