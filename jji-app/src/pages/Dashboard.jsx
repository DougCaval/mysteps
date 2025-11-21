import { useEffect, useState } from "react";
import { signOut } from "../services/auth";
import ProfileForm from "../components/ProfileForm";
import CalendarView from "../components/CalendarView";
import CreateJJCard from "../components/CreateJJCard";
import JJCardList from "../components/JJCardList";
import { getClasses, createClass, deleteClass } from "../services/classes";
import { getAttendance, upsertAttendance } from "../services/attendance";
import { supabase } from "../lib/supabaseClient";
import { formatISO } from "date-fns";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadClasses() {
    setLoading(true);
    const { data, error } = await getClasses();
    setLoading(false);
    if (error) return alert("Erro carregar aulas: " + error.message);
    setClasses(data || []);

    const ev = (data || []).map(c => {
      // create start/end as ISO for react-big-calendar
      const start = new Date(c.class_date + "T" + (c.class_time ? c.class_time : "00:00"));
      const end = new Date(start.getTime() + 1000 * 60 * 60); // 1 hora default
      return {
        id: c.id,
        title: c.title || "Aula",
        start,
        end,
        allDay: false,
        description: c.description
      };
    });
    setEvents(ev);
  }

  useEffect(() => {
    loadClasses();

    // realtime listener opcional: ouvir mudanças na tabela classes
    const subscription = supabase
      .channel('public:classes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, payload => {
        loadClasses();
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  // quando selecionar slot no calendário -> cria uma classe
  async function handleSelectSlot(slotInfo) {
    const title = prompt("Título da aula", "Aula");
    if (!title) return;
    const class_date = slotInfo.start.toISOString().slice(0,10);
    const class_time = slotInfo.start.toTimeString().slice(0,8);
    const { data, error } = await createClass({ title, description: "", class_date, class_time });
    if (error) return alert("Erro ao criar aula: " + error.message);
    loadClasses();
  }

  // clicar evento -> abre opções (marcar presença ou deletar)
  async function handleSelectEvent(event) {
    const choice = prompt("Digite: 1 para marcar presença, 2 para deletar aula");
    if (choice === "1") {
      // open prompt to mark present or not
      const presentStr = prompt("Você foi? (s/n)", "s");
      const present = presentStr && presentStr.toLowerCase().startsWith("s");
      const { data, error } = await upsertAttendance({ class_id: event.id, present });
      if (error) return alert("Erro ao marcar presença: " + error.message);
      alert("Presença registrada");
    } else if (choice === "2") {
      if (!confirm("Deletar aula?")) return;
      const { error } = await deleteClass(event.id);
      if (error) return alert("Erro ao deletar aula: " + error.message);
      loadClasses();
    }
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>Bem-vindo</div>
        <button onClick={() => { signOut(); window.location.href = "/login"; }}>Sair</button>
      </div>

      <ProfileForm />

      <h2>Calendário de Aulas</h2>
      <CalendarView events={events} onSelectSlot={handleSelectSlot} onSelectEvent={handleSelectEvent} />

      <h2>JJ Library</h2>
      <CreateJJCard onCreated={() => { /* recarregar lista */ window.location.reload(); }} />
      <JJCardList />
    </div>
  );
}
