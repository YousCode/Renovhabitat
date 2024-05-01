import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Suivi } from "./suivi";
import { Informations } from "./informations";
import { CreateSheet } from "src/components/createSheet";
import { MonthlyCalendar } from "./monthlyCalendar";

import api from "src/services/api";
import { ProjectContext } from "src/contexts/ProjectContext";

export const ProjectPublicDetail = ({ match }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Suivi");
  const [project, setProject] = useState();

  const [refreshTasks, setRefreshTasks] = useState(false);

  const [taskSelected, setTaskSelected] = useState({});
  const [tasks, setTasks] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);

  const getTasks = async () => {
    const { data } = await api.get(`/project/public/${match.params.id}`);
    setProject(data);
    const { data: newTasks } = await api.get(
      `/task/public/${data._id.toString()}`,
    );
    if (newTasks) setTasks(newTasks);
  };

  useEffect(() => {
    getTasks();
  }, [match, taskSelected, refreshTasks]);

  if (!project) return <div>Loading...</div>;

  return (
    <ProjectContext.Provider
      value={{
        refreshTasks,
        setRefreshTasks,
        taskSelected,
        setTaskSelected,
        tasks,
        setTasks,
        modalOpened,
        setModalOpened,
        project,
        getTasks,
      }}
    >
      <Navbar />
      <section className="text-white m-2.5 lg:my-14 lg:mx-16 space-y-2.5 lg:space-y-0 lg:grid grid-cols-12 gap-5">
        <div className="bg-app p-2 lg:p-4 rounded-lg lg:col-span-8 h-max">
          <div className="pb-3.5 border-b border-placeholder mb-3.5 flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center w-full lg:w-auto gap-x-4 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{project.name}</h2>
              <p className="py-1 px-2.5 rounded-sm bg-badge-gradient text-xxs font-bold text-white">
                {t(`project.category.${project.category}`)}
              </p>
            </div>

            <p className="text-xxs lg:text-sm text-details-secondary text-left">
              Deadline :{" "}
              {project.endAt &&
                new Date(project.endAt).toISOString().split("T")[0]}
            </p>
          </div>
          <MonthlyCalendar />
        </div>

        <div className="bg-app p-2 lg:p-4 rounded-lg lg:col-span-4">
          <div className="border-b border-app-card-bg flex gap-x-7 px-2 mb-2.5">
            <button
              className={`border-b text-details-link font-semibold transition-all ${
                activeTab === "Suivi"
                  ? "border-details-secondary"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("Suivi")}
            >
              {t("projects.suivi")}
            </button>
            <button
              className={`border-b text-details-link font-semibold transition-all ${
                activeTab === "Informations"
                  ? "border-details-secondary"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("Informations")}
            >
              {t("projects.informations")}
            </button>
          </div>

          {activeTab === "Suivi" && (
            <Suivi data={project} onChange={setProject} />
          )}
          {activeTab === "Informations" && (
            <Informations data={project} onChange={setProject} />
          )}
        </div>

        <CreateSheet
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          taskSelected={taskSelected}
          setTaskSelected={setTaskSelected}
          setRefreshTasks={setRefreshTasks}
          setTasks={getTasks}
        />
      </section>
    </ProjectContext.Provider>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="bg-app-navbar sticky top-0 z-50 shadow-md">
      <div className="container flex items-center justify-between p-5 ">
        <img src={require("src/assets/kolab-logo.png")} alt="Kolab Logo" />
        <button className="text-white text-xs lg:text-sm font-bold py-2.5 px-4 rounded bg-[#4119B5]">
          {t("learn_more")}
        </button>
      </div>
    </nav>
  );
};
