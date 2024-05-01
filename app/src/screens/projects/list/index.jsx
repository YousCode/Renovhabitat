import { useEffect, useState } from "react";
import { useModal } from "src/hooks";
import { PlusIcon } from "src/components/icons";
import { useTranslation } from "react-i18next";

import { ProjectCard } from "./projectCard";
import { NewProjectModal } from "./newProjectModal";
import api from "../../../services/api";

export const ProjectList = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("En cours");
  const [totals, setTotals] = useState(null);

  const { openModal, closeModal, isOpen } = useModal();

  useEffect(() => {
    getProjects();
  }, [status]);

  const getProjects = async () => {
    const { data } = await api.get("/project?status=" + status);
    const tasks = await api.get("/task");
    data.forEach((project) => {
      project.tasks = tasks.data.filter((e) => e.projectId === project._id);
    });
    setProjects(data);
    const { data:totals } = await api.get("/project/totals");
    setTotals(totals);
  };

  return (
    <>
      <section className="rounded-2xl bg-app p-4 min-h-[50vh]">
        <div className="flex items-center lg:justify-between flex-col lg:flex-row gap-2">
          <div className="flex items-center gap-2 flex-col lg:flex-row w-full lg:w-auto">
            <button
              onClick={() => setStatus("En cours")}
              className={`py-2 px-4 rounded bg-tertiary-2 text-white font-bold w-full lg:w-auto ${status === "En cours" ? "opacity-100" : "opacity-50"
                } `}
            >
              {t("projects.current")} (
              {totals?.find((total) => total._id === "En cours")?.count || 0})
            </button>
            <button
              onClick={() => setStatus("Cloturé")}
              className={`py-2 px-4 rounded bg-tertiary-4 text-white font-bold w-full lg:w-auto ${status === "Cloturé" ? "opacity-100" : "opacity-50"
                } `}
            >
              {t("projects.closed")} (
              {totals?.find((total) => total._id === "Cloturé")?.count || 0})
            </button>
          </div>
          <button
            className="py-2 px-4 rounded bg-app-button font-bold text-white flex items-center gap-x-2 text-sm w-full lg:w-auto justify-center"
            onClick={openModal}
          >
            <PlusIcon />
            {t("project.new")}
          </button>
        </div>

        <div className="flex flex-col mt-4.5 space-y-4">
          {projects.length === 0 && (
            <div className="flex h-full items-center justify-center  min-h-[460px]">
              <span className=" text-details-secondary text-sm  ">
                Vous n’avez pas encore de projets? :({" "}
              </span>
              <span
                onClick={() => {
                  openModal();
                }}
                className=" text-white  text-sm cursor-pointer ml-1"
              >
                Créez une projet !
              </span>
            </div>
          )}
          {projects.map((project, i) => (
            <ProjectCard key={i} data={project} getProjects={getProjects}/>
          ))}
        </div>
      </section>
      <NewProjectModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};
