import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { hotjar } from "react-hotjar";

import { CreateSheet } from "../../components/createSheet";
import { Select } from "./select";
import { PlusIcon } from "src/components/icons";
import { useCurrentTime } from "src/hooks";

import { WeeklyCalendar } from "./weeklyCalendar";
import { KanbanCard } from "./kanbanCard";

import API from "src/services/api";

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
  const [assignedToFilterCalendar, setAssignedToFilterCalendar] = useState(
    user ? { name: user.name, value: user._id } : { name: "", value: "" }
  );
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

      {/* <CreateSheet
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        taskSelected={taskSelected}
        setTaskSelected={setTaskSelected}
        setRefreshTasks={setRefreshTasks}
        setTasks={setTasks}
      /> */}
    </>
  );
};