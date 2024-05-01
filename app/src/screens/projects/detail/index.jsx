import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Suivi } from "./suivi";
import { Informations } from "./informations";
import { ChevronLeftIcon, CalendarIcon } from "src/components/icons";
import { CreateSheet } from "src/components/createSheet";

import api from "src/services/api";
import { ProjectContext } from "src/contexts/ProjectContext";
import { AiOutlineShareAlt } from "react-icons/ai";
import { Modal } from "src/components/modal";
import { project_category_colors } from "src/utils";


export const ProjectDetail = ({ match }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Suivi");
  const [project, setProject] = useState();

  const [refreshTasks, setRefreshTasks] = useState(false);

  const [taskSelected, setTaskSelected] = useState({});
  const [tasks, setTasks] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);

  const history = useHistory();

  const getTasks = async () => {
    const { data } = await api.get(`/project/${match.params.id}`);
    setProject(data);
    const { data: newTasks } = await api.get(
      `/task/?projectId=${data._id.toString()}`,
    );
    if (newTasks) setTasks(newTasks);
  };

  const categoryStyles = project_category_colors[project?.category] || {};

  const handleDeadlineChange = async (e) => {
    e.preventDefault();
    const { data } = await api.put(`/project/${match.params.id}`, {
      endAt: e.target.value,
    });
    setProject(data);
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
      <section className="bg-app p-4 rounded-lg">
        <div className="flex items-center lg:justify-between flex-col sm:flex-row gap-2">
          <div className="flex items-center w-full lg:w-auto">
            <button onClick={() => history.push("/projects")}>
              <ChevronLeftIcon className="mr-2" />
            </button>
            <h2 className="text-2xl font-bold text-white mr-4">
              {project.name}
            </h2>
            <button className={`py-1 px-2.5 rounded-sm text-xxs font-bold text-white ${categoryStyles.bg} ${categoryStyles.border}`}>
              {t(`project.category.${project.category}`)}
            </button>
          </div>
          <div className="space-y-1 shrink-0 sm:w-1/4 w-full">
            <p className="text-xxs text-details-secondary">Deadline</p>
            <div>
              <div className="relative">
                <CalendarIcon
                  className="w-4 h-4 text-details-secondary absolute top-1/2 -translate-y-1/2 left-2.5 z-10"
                  noModal="true"
                />
                <input
                  type="date"
                  value={
                    project.endAt
                      ? new Date(project.endAt).toISOString().split("T")[0]
                      : ""
                  }
                  placeholder="Ajouter une date"
                  className="pl-10 bg-placeholder text-xs rounded-md w-full text-details-link ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none cursor-pointer placeholder:text-details-link pr-10"
                  onFocus={(e) => (e.target.type = "date")}
                  onChange={handleDeadlineChange}
                  noModal="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 -mx-4 px-4 border-b border-app-card-bg flex gap-x-7 justify-between">
          <div className="flex gap-x-7">
            <button
              className={`border-b text-details-link font-bold pb-2.5 transition-all ${activeTab === "Suivi"
                  ? "border-details-secondary"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("Suivi")}
            >
              {t("projects.suivi")}
            </button>
            <button
              className={`border-b text-details-link font-bold pb-2.5 transition-all ${activeTab === "Informations"
                  ? "border-details-secondary"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("Informations")}
            >
              {t("projects.informations")}
            </button>
          </div>

          <Share project={project} />
        </div>

        <div className="lg:py-6 pt-4">
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

// public share modal

const Share = ({ project }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => setIsShareOpen(!isShareOpen)}
        className="border-b text-details-link font-bold pb-2.5 transition-all border-transparent"
      >
        <AiOutlineShareAlt
          size={30}
          className=" p-1.5 bg-app-task-bg text-details-secondary rounded "
        />
      </button>
      {isShareOpen && (
        <Modal isOpen={isShareOpen} closeModal={() => setIsShareOpen(false)}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Partager</h3>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              value={`${window.location.origin}/public/project/${project._id}/welcome`}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm text-white placeholder:text-details-secondary px-4 py-3"
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/public/project/${project._id}/welcome`,
                );
              }}
              className="bg-app-task-bg rounded-md px-4 py-2 text-details-secondary text-sm font-bold"
            >
              Copier
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
