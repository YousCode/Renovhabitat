import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { CalendarIcon, CloseIcon } from "src/components/icons";
import { Modal } from "src/components/modal";

import api from "../../../services/api";

import { project_categories } from "src/utils";

export const NewProjectModal = ({ isOpen, closeModal }) => {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", category: "" });

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/project", values);
    history.push(`/projects/${data._id}`);
    toast.success("Projet créé avec succès");
  };


  return (
    <Modal isOpen={isOpen} closeModal={closeModal} className="p-6">
      <h1 className="text-2xl font-bold text-white text-center mb-4">
        {t("project.create_new")}
      </h1>
      <button className="absolute top-6 right-6" onClick={closeModal}>
        <CloseIcon />
      </button>
      <form
        className="grid grid-cols-2 gap-x-2.5 gap-y-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <label
            className="text-xxs font-bold text-details-secondary block"
            htmlFor="name"
          >
            {t("project.name")}
          </label>
          <input
            type="text"
            className="bg-app-card-secondary border-transparent rounded w-full text-sm font-bold text-white placeholder:text-details-secondary px-4 h-11"
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
          <Listbox
            value={values.category}
            onChange={(category) => setValues({ ...values, category })}
            as="ul"
            className="relative"
          >
            <Listbox.Button className="bg-app-card-secondary border-transparent rounded w-full text-sm text-details-secondary/80 placeholder:text-details-secondary h-11 px-4 text-left">
              {values.category}
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-app-card-secondary py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {project_categories.map((item, i) => (
                  <Listbox.Option
                    key={i}
                    value={item}
                    className={({ active }) =>
                      `${
                        active
                          ? "bg-white/5 text-white"
                          : "text-details-secondary"
                      } px-4 transition-colors py-1 cursor-pointer`
                    }
                  >
                    {t(`project.category.${item}`)}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
        <div className="space-y-1">
          <label
            className="text-xxs font-bold text-details-secondary block"
            htmlFor="name"
          >
            Deadline
          </label>
          <div className="relative">
            <CalendarIcon className="w-4 h-4 text-details-secondary absolute top-1/2 -translate-y-1/2 left-2.5 z-10" />
            <input
              type="text"
              placeholder="Ajouter une date"
              className="px-10 bg-app-card-secondary text-sm rounded-md w-full text-details-secondary ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none cursor-pointer placeholder:text-details-secondary py-2.5 text-center"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={(e) => setValues({ ...values, endAt: e.target.value })}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-1/3 col-span-2 text-white font-bold rounded bg-[#4119B5] py-3 px-4 mx-auto"
        >
          {t("project.create")}
        </button>
      </form>
    </Modal>
  );
};
