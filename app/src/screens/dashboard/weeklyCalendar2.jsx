import { useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi"; // needed for dayClick

import API from "src/services/api";
import { useSelector } from "react-redux";
import { Select } from "./select";
import { task_category_colors, task_categories } from "src/utils";

export const WeeklyCalendar = ({
  setTaskSelected,
  setModalOpened,
  tasks,
  projects,
  projectFilterCalendar,
  setTasks,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    const dayToday = document.querySelector(".fc-day-today").querySelector(".fc-scrollgrid-sync-inner");

    dayToday.style.display = "flex";
    dayToday.style.alignItems = "center";
    dayToday.style.justifyContent = "center";

    if (dayToday.querySelector("#dot")) return;

    const dot = document.createElement("div");
    dot.setAttribute("id", "dot");
    dot.classList.add("bg-red-500", "w-1.5", "h-1.5", "rounded-full");
    dayToday.appendChild(dot);
    // i don't know if this is the best way to do it but it works
    // because i can't override the css of the toolbar
    const toolbar = document.querySelector(".fc-toolbar-title");
    toolbar.style.fontSize = "12px";
    toolbar.style.marginRight = "9px";
    toolbar.style.marginTop = "2px";
  }, []);

  return (
    <div className="py-4 px-2 bg-app rounded-lg flex-1">


      <div className="tasks-calendar lg:!-mt-[2.3rem]">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridDay"
          hiddenDays={[0]}
          dateClick={(e) => {
            let dayDate = e.date;
            dayDate.setHours(12);
            setTaskSelected({ startsAt: dayDate, endsAt: dayDate });
            setModalOpened(true);
          }}
          editable={true}
          eventDrop={async (e) => {
            await API.put(`/task/${e.event?._def?.extendedProps?._id}`, {
              delta: e.delta,
            });
            setTasks();
          }}
          locale={user?.language}
          contentHeight="auto"
          dayHeaderClassNames="bg-app-accent !border !border-r !border-app-light !text-app-light !p-2.5 capitalize font-normal text-xs"
          dayCellClassNames="!border-none hover:cursor-pointer group"
          titleFormat={{ year: "numeric", month: "long", day: "2-digit" }}
          dayHeaderFormat={{ weekday: "long", day: "numeric",month: "long" }}
          headerToolbar={{
            left: "prev title next",
            right: "",
          }}
          dayCellContent={(info) => (
            <DayCell value={info} eventExists={tasks.some((s) => new Date(s.createdAt).getDate() === new Date(info.createdAt).getDate())} />
          )}
          eventContent={(info) => (
            <Event
              value={info}
              onChange={(task) => {
                setTaskSelected(task);
                setModalOpened(true);
              }}
            />
          )}
          events={[
            ...projects
              .filter((e) => e._id.toString() === projectFilterCalendar.value || projectFilterCalendar.value === "all")
              .map((s, index) => {
                s.type = "project";
                return {
                  id: "project-" + index,
                  title: s.name,
                  start: s.endAt || s.createdAt,
                  startsAt: s.endAt ? new Date(s.endAt) : null,
                  end: s.endAt || s.createdAt,
                  endsAt: s.endAt ? new Date(s.endAt) : null,
                  extendedProps: s,
                  color: "rgba(0, 0, 0, 0)",
                };
              }),
            ...tasks.map((s, index) => {
              s.type = "task";
              return {
                id: "task-" + index,
                title: s.title,
                start: s.startsAt || s.createdAt,
                startsAt: s.startsAt ? new Date(s.startsAt) : null,
                end: s.endsAt || s.startsAt,
                endsAt: s.endsAt ? new Date(s.endsAt) : new Date(s.startsAt),
                extendedProps: s,
                color: "rgba(0, 0, 0, 0)",
              };
            }),
          ]}
        />
      </div>
    </div>
  );
};

const DayCell = ({ value, onClick }) => {
  return (
    <div>
      <div className="relative z-20 font-bold text-ms">{value.dayNumberText}</div>
      <div
        onClick={onClick}
        className="p-1 text-center rounded w-full z-40 cursor-pointer bg-app-button opacity-0  group-hover:opacity-100 absolute top-0 left-0 "
      >
        <HiPlus className="text-base mx-auto leading-none text-white" />
        <span className="text-xs font-bold text-deepspace-100"></span>
      </div>
    </div>
  );
};

const Event = ({ value, onChange }) => {
  const title = value.event.title;
  const event = value.event._def.extendedProps;

  return (
    <div
      className={`w-full rounded cursor-pointer px-2.5 py-1.5 ${event.type === "project" ? "bg-app-maroon" : "bg-app-task-bg"}`}
      onClick={() => onChange(event)}
    >
      <div className="flex items-center gap-x-1.5">
      <div className={`text-xs flex items-center gap-x-1 font-bold whitespace-nowrap ${task_category_colors[event.category]?.text}`}>
      <div className={`mr-2 w-1.5 h-1.5 rounded-full ${task_category_colors[event.category]?.bg || 'bg-tertiary'}`} />
          {event.type === "project" ? "Deadline : " : ""}{title}
        </div>

        {event.type === "task" && <div className="text-xs text-white underline">{event?.projectName || ""}</div>}
        
      </div>
    </div>
  );
};