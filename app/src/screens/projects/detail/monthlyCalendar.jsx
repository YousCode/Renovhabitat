import { useContext } from "react";
import { useTranslation } from "react-i18next";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { ProjectContext } from "../../../contexts/ProjectContext";
import { PlusIcon } from "src/components/icons";
import API from "src/services/api";

export const MonthlyCalendar = () => {
  const { t } = useTranslation();
  const { setModalOpened, setTaskSelected, tasks, project, getTasks } =
    useContext(ProjectContext);

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="lg:absolute right-0">
          <button
            onClick={() => {
              setTaskSelected({
                projectId: project._id.toString(),
                projectName: project.name,
                projectCategory: project.category,
              });
              setModalOpened(true);
            }}
            className="py-2 px-4 rounded-[10px] bg-app-button ml-auto font-bold text-white flex items-center gap-x-2 text-sm w-full justify-center"
          >
            <PlusIcon />
            {t("task.new")}
          </button>
        </div>
      </div>
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
          dayHeaderFormat={{ weekday: "long", day: "numeric" }}
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
