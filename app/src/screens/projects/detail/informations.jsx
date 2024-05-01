import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import api from "../../../services/api";
import { project_categories } from "src/utils";

export const Informations = ({ data, onChange }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put(`/project/${values._id}`, values);
    onChange(data);
    toast.success("Projet modifié avec succès");
  };


  return (
    <div className="grid grid-cols-12 gap-x-5">
      <div className="col-span-8 space-y-2">
        <h5 className="font-bold text-white">
          {t("projects.informations.detail")}
        </h5>
        <form onSubmit={handleSubmit} className="bg-app-card-bg p-4 rounded">
          <div className="w-4/5 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                className="text-xxs font-bold text-details-secondary block"
                htmlFor="name"
              >
                {t("project.name")}
              </label>
              <input
                type="text"
                placeholder={t("projects.informations.write")}
                className="bg-app-card-secondary border-transparent rounded w-full text-sm text-white placeholder:text-details-secondary px-4 py-3"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xxs font-bold text-details-secondary block"
                htmlFor="name"
              >
                {t("category")}
              </label>
              <select
                className="bg-app-card-secondary border-transparent rounded w-full text-sm text-white placeholder:text-details-secondary px-4 py-3"
                value={values.category}
                onChange={(e) =>
                  setValues({ ...values, category: e.target.value })
                }
              >
                <option value="" disabled></option>
                {project_categories.map((category, i) => (
                  <option key={category} value={category}>
                    {t(`project.category.${category}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="py-2 px-4 rounded-lg bg-[#231156] mt-6 text-white font-bold"
              type="submit"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
      <div className="col-span-4 space-y-2">
        <h5 className="font-bold text-white">
          {t("projects.informations.history")}
        </h5>
        <div className="bg-app-card-bg rounded p-4 space-y-4">
          <p className="text-xs text-details-link">
            <b>{t("projects.informations.creation")} </b>{" "}
            {new Date(values.createdAt).toISOString().slice(0, 10)}
          </p>
          <p className="text-xs text-details-link">
            <b>{t("projects.informations.modification")}</b>{" "}
            {values.updatedAt
              ? new Date(values.updatedAt).toLocaleString()
              : "--"}
          </p>
        </div>
      </div>
    </div>
  );
};
