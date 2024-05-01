import { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { ProjectContext } from "src/contexts/ProjectContext";
import API from "src/services/api";

export const MonthlyCalendar = () => {
  const { setModalOpened, setTaskSelected, tasks, project, getTasks } =
    useContext(ProjectContext);

    useEffect(() => {
      const addRedDotToToday = () => {
          const dayNumber = document.querySelector('.fc-day-today .fc-daygrid-day-number');
          if (!dayNumber) return;
  
          dayNumber.style.display = 'flex';
          dayNumber.style.alignItems = 'center';
  
          if (dayNumber.querySelector(".red-dot")) return;
  
          const dot = document.createElement('div');
          dot.classList.add("ml-2", "bg-red-500", "w-1.5", "h-1.5", "rounded-full", "red-dot");
          dayNumber.appendChild(dot);
      };
      
      addRedDotToToday();
  }, []);  

  return (
    <div className="space-y-2">
      <div className="monthly-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={"fr"}
          dateClick={(e) => {
            let dayDate = e.date;
            dayDate.setHours(12);
            setTaskSelected({
              startsAt: dayDate,
              endsAt: dayDate,
              projectId: project._id.toString(),
              projectName: project.name,
              projectCategory: project.category,
            });
            setModalOpened(true);
          }}
          editable={true}
          eventDrop={async (e) => {
            await API.put(`/task/${e.event?._def?.extendedProps?._id}`, {
              delta: e.delta,
            });
            getTasks();
          }}
          contentHeight="auto"
          dayHeaderClassNames="bg-app-accent !border !border-r !border-app-light !text-app-light !p-2.5 capitalize font-normal text-xs"
          titleFormat={{ year: "numeric", month: "long" }}
          dayHeaderFormat={{ weekday: "long"}}
          dayCellClassNames=" hover:cursor-pointer"
          headerToolbar={{
            left: "prev title next",
            right: "",
          }}
          weekends={false}
          eventContent={(info) => (
            <EventContent
              value={info}
              onChange={(task) => {
                setTaskSelected(task);
                setModalOpened(true);
              }}
            />
          )}
          events={tasks.map((s, index) => {
            return {
              id: index,
              title: s.title,
              start: s.startsAt || s.createdAt,
              startsAt: s.startsAt ? new Date(s.startsAt) : null,
              end: s.endsAt || s.startsAt,
              endsAt: s.endsAt ? new Date(s.endsAt) : new Date(s.startsAt),
              extendedProps: s,
              color: "rgba(0, 0, 0, 0)",
            };
          })}
        />
      </div>
    </div>
  );
};

const EventContent = ({ value, onChange }) => {
  const title = value.event._def.title;
  const event = value.event._def.extendedProps;

  return (
    <div
      className={`w-full rounded text-ms px-2.5 py-1.5 bg-app-task-bg flex items-center gap-x-1`}
      onClick={() => onChange(event)}
    >
      <div className="w-1 h-1 rounded-full bg-tertiary" />
      <p className={`text-xs font-bold whitespace-normal text-tertiary`}>
        {title}
      </p>
    </div>
  );
};
