import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import api from "src/services/api";

export const WelcomeProject = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [project, setProject] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/project/public/${id}`);
      setProject(data);
    })();
  }, []);

  if (!project) return;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col p-6 pb-20 gap-6">
        <div className="flex flex-col flex-1">
          <div className="bg-app bg-welcome bg-no-repeat bg-cover bg-center rounded-lg flex-1 flex items-center justify-center relative">
            <div className="w-full h-full absolute bg-welcome-gradient rotate-180" />
            <div className="text-center z-10">
              <p className="font-semibold text-[#AE9DE2] text-lg lg:text-2xl">
                {t("project")} :
              </p>
              <h1 className="text-4xl lg:text-6xl font-semibold text-white">
                {project.name}
              </h1>
              <p className="text-lg lg:text-xl font-semibold text-white">
                &quot;{project.workspace_name}&quot;
              </p>
            </div>
            <p className="absolute text-center text-white text-lg lg:text-2xl bottom-7 leading-tight px-10 lg:px-20">
              Kolab est la première plateforme collaborative spécialement créée
              pour la post-production.
            </p>
          </div>
        </div>
        <Link
          to={`/public/project/${project._id}`}
          className="text-white text-xs lg:text-lg font-bold py-2.5 lg:py-4 px-4 lg:px-6 rounded bg-[#3D19A4] block text-center w-full lg:w-max lg:mx-auto mb-2"
        >
          {t("access_project")}
        </Link>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center justify-between p-5 bg-app-navbar">
      <img src={require("src/assets/kolab-logo.png")} alt="Kolab Logo" />
      <button className="text-white text-xs font-bold py-2.5 px-4 rounded bg-[#4119B5]">
        {t("learn_more")}
      </button>
    </nav>
  );
};
