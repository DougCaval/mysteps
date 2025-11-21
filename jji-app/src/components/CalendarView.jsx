import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarView({ events, onSelectSlot, onSelectEvent }) {
  return (
    <Calendar
      selectable
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
    />
  );
}
