import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { CreateSheet } from "../../components/createSheet";
import { Select } from "./select";
import { PlusIcon } from "src/components/icons";
import { useCurrentTime } from "src/hooks";

import { WeeklyCalendar } from "./weeklyCalendar";
import { KanbanCard } from "./kanbanCard";

import API from "src/services/api";
import { Link, useLocation } from "react-router-dom";
import { hotjar } from "react-hotjar";

export const Dashboard = () => {
  const { t } = useTranslation();
  const currentTime = useCurrentTime();
  const user = useSelector((state) => state.Auth.user);

  const minutes = currentTime.getMinutes().toString();
  const formattedTime = currentTime.getHours() + ":" + minutes.padStart(2, "0");
  const [statusFilterList, setStatusFilterList] = useState(t("task.todo"));
  const [assignedToFilterList, setAssignedToFilterList] = useState(
    t("dashboard.me")
  );
  const [statusFilterCalendar, setStatusFilterCalendar] = useState(
    t("task.todo")
  );
  const [assignedToFilterCalendar, setAssignedToFilterCalendar] = useState({
    name: user.name,
    value: user._id,
  });
  const [projectFilterCalendar, setProjectFilterCalendar] = useState({
    name: t("dashboard.all_projects"),
    value: "all",
  });
  const [people, setPeople] = useState([]);
  const [projects, setProjects] = useState([]);
  const [refreshTasks, setRefreshTasks] = useState(false);

  const [taskSelected, setTaskSelected] = useState({});
  const [tasksList, setTasksList] = useState([]);
  const [tasksCalendar, setTasksCalendar] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (hotjar.initialized()) {
      hotjar.stateChange(location);
    }
  }, [location]);

  function setTasks() {
    getTasksList();
    getTasksCalendar();
  }

  async function getTasksList() {
    const { data, ok } = await API.get(
      `/task?status=${
        statusFilterList === t("task.todo") ? "A faire" : "Clôturé"
      }&assignedTo=${
        assignedToFilterList === t("dashboard.me") ? "Moi" : "Everyone"
      }`
    );

    if (!ok) return;
    data.forEach((task) => {
      if ("startsAt" in task) task.startsAt = new Date(task.startsAt);
      if ("endsAt" in task) task.endsAt = new Date(task.endsAt);
    });
    setTasksList(data);
  }

  async function getTasksCalendar() {
    const { data, ok } = await API.get(
      `/task?status=${
        statusFilterCalendar === t("task.todo") ? "A faire" : "Clôturé"
      }&assignedId=${assignedToFilterCalendar.value}&projectId=${
        projectFilterCalendar.value
      }`
    );

    if (!ok) return;
    data.forEach((task) => {
      if ("startsAt" in task) task.startsAt = new Date(task.startsAt);
      if ("endsAt" in task) task.endsAt = new Date(task.endsAt);
    });
    setTasksCalendar(data);
  }

  async function getUsers() {
    const { data, ok } = await API.get("/user");
    if (!ok) return;
    setPeople(data);
  }
  async function getProjects() {
    const { data, ok } = await API.get("/project");
    if (!ok) return;
    setProjects(data);
  }

  useEffect(() => {
    getTasksList();
  }, [statusFilterList, assignedToFilterList, refreshTasks]);

  useEffect(() => {
    getTasksCalendar();
  }, [
    statusFilterCalendar,
    assignedToFilterCalendar,
    projectFilterCalendar,
    refreshTasks,
  ]);

  useEffect(() => {
    getUsers();
    getProjects();
  }, []);

  if (!tasksList || !tasksCalendar) return null;

  const hour = currentTime.getHours();
  const isMorning = hour >= 6 && hour < 12;

  return (
    <>
      <section className="space-y-6 flex flex-col flex-1">
        
          {/* <div className="lg:col-span-3 4xl:col-span-2 rounded-2xl overflow-hidden relative">
          <img 
            className="object-cover bg-right w-full h-full aspect-video"
            src={
              isMorning 
              ? require("src/assets/morning.gif") 
              : require("src/assets/evening.gif")
            } 
            alt="Morning or Evening visual representation" 
          />
            <div className="absolute top-5 left-7">
              <p className="font-bold text-xs text-white">
                {new Date().toLocaleDateString(
                  [user?.language === "fr" ? "fr-FR" : "en-US"],
                  {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                  },
                )}
              </p>
              <h1 className="text-4xl font-bold text-green-500">{t("hello")} !</h1>
              <p className="text-xs text-white -mt-1">{user.name}.</p>
            </div>

            <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-black/50 text-white text-sm font-bold">
              {formattedTime}
            </div>

            <div className="w-full h-[80%] bg-image-gradient absolute bottom-0" />
          </div>
          <div className="lg:col-span-9 4xl:col-[span_16_/_span_16] p-4 space-y-2 overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center flex-col lg:flex-row gap-2 w-full lg:w-auto">
                <p className="font-bold text-green-500">{t("tasks")}</p>
                <Select
                  prefix={t("status")}
                  value={statusFilterList}
                  list={[t("task.todo"), t("task.closed")]}
                  onChange={setStatusFilterList}
                />

                <Select
                  prefix={t("task.assigned_person")}
                  value={assignedToFilterList}
                  list={[t("dashboard.me"), t("dashboard.everyone")]}
                  onChange={setAssignedToFilterList}
                />
              </div>
              <button
                onClick={() => {
                  setTaskSelected({});
                  setModalOpened(true);
                }}
                className="py-2 px-4 rounded-[10px] bg-app-button font-bold text-green-500 flex items-center justify-center gap-x-2 text-sm w-full lg:w-auto"
              >
                <PlusIcon />
                {t("task.new")}
              </button>
            </div>
            {tasksList.length === 0 && (
              <div className=" w-full h-full flex justify-center items-center flex-col">
                <div>
                  <span className=" text-details-secondary text-sm  ">
                    Vous n’avez pas encore de vente assignée :{" "}
                  </span>
                  <span
                    onClick={() => {
                      setTaskSelected({});
                      setModalOpened(true);
                    }}
                    className=" text-white  text-sm cursor-pointer ml-1"
                  >
                    Créez une Vente
                  </span>
                </div>
                <div>
                  <span className=" text-details-secondary text-sm ">
                    Vous êtes tout seul ?{" "}
                  </span>
                  <Link
                    to="/equipe"
                    className=" text-white text-sm cursor-pointer ml-1 "
                  >
                    Invitez d’abord vos collègues
                  </Link>
                </div>
              </div>
            )}
            <div className="flex overflow-x-auto mb-4">
              <div className="flex space-x-2">
                {/* {tasksList.map((task) => (
                  // <KanbanCard
                  //   projects={projects}
                  //   people={people}
                  //   task={task}
                  //   setTasks={setTasks}
                  //   setTaskSelected={setTaskSelected}
                  //   key={task._id}
                  //   setModalOpened={setModalOpened}
                  // />
                // ))} */}
              {/* </div>
            </div>
          </div> */}
        <WeeklyCalendar
          setTaskSelected={setTaskSelected}
          setModalOpened={setModalOpened}
          people={people}
          tasks={tasksCalendar}
          projects={projects}
          assignedToFilterCalendar={assignedToFilterCalendar}
          setAssignedToFilterCalendar={setAssignedToFilterCalendar}
          statusFilterCalendar={statusFilterCalendar}
          setStatusFilterCalendar={setStatusFilterCalendar}
          projectFilterCalendar={projectFilterCalendar}
          setProjectFilterCalendar={setProjectFilterCalendar}
          setTasks={setTasks}
        />
      </section>

      <CreateSheet
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        taskSelected={taskSelected}
        setTaskSelected={setTaskSelected}
        setRefreshTasks={setRefreshTasks}
        setTasks={setTasks}
      />
    </>
  );
};