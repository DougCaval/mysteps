import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s?.session ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return children;
}
