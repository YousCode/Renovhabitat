import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Popover, Menu } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CalendarIcon, MedianPoint, PlusIcon } from "src/components/icons";
import API from "src/services/api";
import { task_categories } from "src/utils";

export const CreateSheet = ({
  modalOpened = false,
  setModalOpened,
  taskSelected = {},
  setTaskSelected,
  setRefreshTasks,
  setTasks,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    title: t("task.without_title"),
    category: null,
    projectId: "",
    projectName: "",
    projectCategory: "",
    assignedId: "",
    assignedName: "",
    assignedAvatar: "",
    startsAt: "",
    endsAt: "",
    notes: "",
  });
  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);

  async function getProjects() {
    if (window.location.pathname.includes("/public")) return;
    const { data, ok } = await API.get("/project");
    if (!ok) return;
    setProjects(data);
  }
  async function getUsers() {
    if (window.location.pathname.includes("/public")) return;
    const { data, ok } = await API.get("/user");
    if (!ok) return;
    setPeople(data);
  }

  const isPublic = window.location.pathname.includes("/public");

  useEffect(() => {
    clear();
    setValues({
      title: taskSelected.title ?? "",
      category: taskSelected.category ?? "",
      projectId: taskSelected.projectId ?? "",
      projectName: taskSelected.projectName ?? "",
      projectCategory: taskSelected.projectCategory ?? "",
      assignedId: taskSelected.assignedId ?? "",
      assignedName: taskSelected.assignedName ?? "",
      assignedAvatar: taskSelected.assignedAvatar ?? "",
      startsAt: taskSelected.startsAt ?? new Date(),
      endsAt: taskSelected.endsAt ?? new Date(),
      notes: taskSelected.notes ?? "",
    });
  }, [taskSelected]);

  useEffect(() => {
    getProjects();
    getUsers();
  }, []);

  const clear = () => {
    setValues(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.title) {
      values.title = t("task.without_title");
    }

    if (!values.category) {
      delete values.category;
    }

    const { data, ok } = taskSelected.hasOwnProperty("title")
      ? await API.put(`/task/${taskSelected._id}`, values)
      : await API.post("/task", values);

    if (!ok) return;
    clear();
    setRefreshTasks((prev) => !prev);
    setTaskSelected({});
    setModalOpened(false);
  };

  if (!values) return null;
  return (
    <Transition.Root show={modalOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setModalOpened(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-y-0 right-0 flex lg:w-1/3 w-9/12">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="-translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="-translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel
              as="form"
              onSubmit={handleSubmit}
              className="relative flex flex-1 bg-app-card-bg overflow-y-auto p-4 flex-col space-y-4"
            >
              <div className="flex items-center justify-between">
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() => setModalOpened(false)}
                  type="button"
                >
                  <BackIcon />
                </button>
                <button
                  className="flex items-center justify-center gap-x-1"
                  type="button"
                >
                  <Menu as={Fragment}>
                    <Menu.Button
                      disabled={
                        isPublic || !taskSelected.hasOwnProperty("title")
                      }
                      className="flex items-end justify-end gap-x-[3px] w-7 h-6 hover:border-details-secondary rounded transition-all"
                      noModal="true"
                    >
                      <ThreeDotsIcon className="w-1 h-1 bg-details-secondary rounded-full" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      className="mt-15"
                    >
                      <Menu.Items
                        className="absolute z-50 right-12 mt-12 w-32 divide-y divide-[#291C4B] rounded bg-app-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        noModal="true"
                      >
                        <div className="px-1 py-1" noModal="true">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`group flex text-xs w-full items-center rounded-sm px-2 py-1 text-details-secondary ${active && "bg-app-background"
                                } transition-colors`}
                                noModal="true"
                                onClick={async () => {
                                  const { data } = await API.put(
                                    `/task/${taskSelected._id}`,
                                    {
                                      ...values,
                                      status:
                                        taskSelected.status === "A faire"
                                          ? "Clôturé"
                                          : "A faire",
                                    },
                                  );
                                  setTasks();
                                }}
                              >
                                {taskSelected.status === "A faire"
                                  ? t("task.close")
                                  : t("task.reopen")}
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={`/projects/${taskSelected.projectId}`}
                                className={`group flex text-xs w-full items-center rounded-sm px-2 py-1 text-details-secondary ${active && "bg-app-background"
                                } transition-colors`}
                              >
                                {t("project.see")}
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`group flex text-xs w-full items-center rounded-sm px-2 py-1 text-details-secondary ${active && "bg-app-background"
                                } transition-colors`}
                                onClick={async () => {
                                  const { ok } = await API.remove(
                                    `/task/${taskSelected._id}`,
                                  );
                                  if (!ok) return;
                                  setTasks();
                                }}
                                noModal="true"
                              >
                                {t("task.delete")}
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </button>
              </div>

              <input
                value={values.title || ""}
                onChange={(e) =>
                  setValues({ ...values, title: e.target.value })
                }
                readOnly={isPublic}
                className="bg-app-card-secondary border-transparent rounded w-full text-sm font-bold text-details-secondary placeholder:text-details-secondary px-4 py-3"
                placeholder={t("task.without_title")}
              />
              <div className="flex items-center">
                <label
                  htmlFor="category"
                  className="inline-block text-details-secondary text-sm font-bold w-[15%]"
                >
                  {t("category")}
                </label>
                <Popover className="w-full pl-2">
                  <div className="relative z-40 w-full">
                    <Popover.Button
                      disabled={isPublic}
                      className="flex items-center gap-x-2 text-xs underline text-white "
                    >
                      {values.category
                        ? t(`task.category.${values.category}`)
                        : t("task.assign_category")}
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Popover.Panel className="absolute space-y-2.5 right-0 mt-2 w-full origin-top-right rounded-md bg-[#160E2D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                        {task_categories.map((category, i) => (
                          <label
                            key={i}
                            className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors"
                          >
                            <input
                              type="radio"
                              className="h-3 w-3 rounded-full border border-details-link bg-transparent !ring-0 !outline-0 text-details-link"
                              value={category}
                              name="category"
                              readOnly={isPublic}
                              onClick={async (e) => {
                                setValues({
                                  ...values,
                                  category: category,
                                });
                              }}
                            />
                            {t(`task.category.${category}`)}
                          </label>
                        ))}
                      </Popover.Panel>
                    </Transition>
                  </div>
                </Popover>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="category"
                  className="inline-block text-details-secondary text-sm font-bold w-[15%]"
                >
                  {t("project")}
                </label>
                <Popover className="w-full pl-2">
                  <div className="relative z-30">
                    <Popover.Button
                      disabled={isPublic}
                      className="flex items-center gap-x-2 text-xs underline text-white "
                    >
                      {values.projectId
                        ? values.projectName
                        : "Assigner un projet"}
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Popover.Panel className="absolute space-y-2.5 right-0 mt-2 w-full origin-top-right rounded-md bg-[#160E2D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                        {projects.length === 0 && (
                          <Link
                            to="/projects"
                            className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors"
                            noModal="true"
                          >
                            <PlusIcon className="w-3 h-3" noModal="true" />
                            {t("project.create")}
                          </Link>
                        )}

                        {projects.map((project, i) => (
                          <label
                            className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors"
                            key={i}
                          >
                            <input
                              type="radio"
                              className="h-3 w-3 rounded-full border border-details-link bg-transparent !ring-0 !outline-0 text-details-link"
                              name="project"
                              readOnly={isPublic}
                              onClick={async (e) => {
                                setValues({
                                  ...values,
                                  projectId: project._id,
                                  projectName: project.name,
                                  projectCategory: project.category,
                                });
                              }}
                            />
                            {project.name}
                          </label>
                        ))}
                      </Popover.Panel>
                    </Transition>
                  </div>
                </Popover>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-details-secondary inline-block">
                  {t("task.assigned_person")}
                </label>

                <Popover>
                  <div className="relative z-20">
                    <Popover.Button
                      disabled={isPublic}
                      className="py-2 bg-placeholder rounded-md flex items-center w-full ring-1 ring-transparent hover:ring-details-secondary transition-all"
                    >
                      {values.assignedId ? (
                        <div className="flex items-center gap-x-2 ml-2">
                          <img
                            src={values.assignedAvatar}
                            alt="avatar"
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-details-link text-xs flex-1 text-center">
                            {values.assignedName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-details-link text-xs flex-1 text-center">
                          {t("task.assign_person")}
                        </span>
                      )}
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Popover.Panel className="absolute space-y-2.5 right-0 mt-2 w-full origin-top-right rounded-md bg-[#160E2D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                        {people.map((person, i) => (
                          <label
                            className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors"
                            key={i}
                          >
                            <input
                              type="radio"
                              name="assignedTo"
                              readOnly={isPublic}
                              className="h-3 w-3 rounded-full border border-details-link bg-transparent !ring-0 !outline-0 text-details-link"
                              onClick={async (e) => {
                                setValues({
                                  ...values,
                                  assignedId: person._id,
                                  assignedName: person.name,
                                  assignedAvatar: person.avatar,
                                });
                              }}
                            />
                            {person.name}
                          </label>
                        ))}
                      </Popover.Panel>
                    </Transition>
                  </div>
                </Popover>
              </div>
              <div className="space-y-px">
                <label className="text-sm font-bold text-details-secondary inline-block">
                  {t("start_date")}
                </label>
                <div>
                  <div className="relative">
                    <CalendarIcon className="w-4 h-4 text-details-secondary absolute top-1/2 -translate-y-1/2 left-2.5 z-10" />
                    <input
                      readOnly={isPublic}
                      value={
                        values.startsAt instanceof Date
                          ? values.startsAt.toISOString().slice(0, 10)
                          : values.startsAt
                      }
                      type="date"
                      placeholder="Ajouter une date"
                      className="px-10 bg-placeholder text-sm rounded-md w-full text-white ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none cursor-pointer placeholder:text-details-secondary py-2.5 text-center"
                      onChange={(e) => {
                        setValues({
                          ...values,
                          startsAt: new Date(e.target.value),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-px">
                <label className="text-sm font-bold text-details-secondary inline-block">
                  {t("end_date")}
                </label>
                <div>
                  <div className="relative">
                    <CalendarIcon className="w-4 h-4 text-details-secondary absolute top-1/2 -translate-y-1/2 left-2.5 z-10" />
                    <input
                      readOnly={isPublic}
                      value={
                        values.endsAt instanceof Date
                          ? values.endsAt.toISOString().slice(0, 10)
                          : values.endsAt
                      }
                      type="date"
                      placeholder="Ajouter une date"
                      className="px-10 bg-placeholder text-sm rounded-md w-full text-white ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none cursor-pointer placeholder:text-details-secondary py-2.5 text-center"
                      onChange={(e) => {
                        setValues({
                          ...values,
                          endsAt: new Date(e.target.value),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-px">
                <label className="text-sm font-bold text-details-secondary inline-block">
                  Notes
                </label>
                <textarea
                  rows={window.innerHeight > 680 ? 8 : 2}
                  value={values.notes}
                  readOnly={isPublic}
                  onChange={(e) =>
                    setValues({ ...values, notes: e.target.value })
                  }
                  placeholder={t("task.add_notes")}
                  className="p-2.5 border-none rounded-md w-full resize-none bg-app-card-secondary text-details-secondary text-sm placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                />
              </div>
              {!isPublic && (
                <button
                  type="submit"
                  className="text-white font-bold py-2 px-4 bg-app-button w-max mx-auto rounded-lg"
                >
                  {t("save")}
                </button>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const BackIcon = () => {
  return (
    <svg width="17" height="14" fill="none" viewBox="0 0 17 14">
      <path fill="#fff" d="M11.5 0H7l5 7-5 7h4.5l5-7-5-7z"></path>
      <path fill="#fff" d="M4.5 0H0l5 7-5 7h4.5l5-7-5-7z"></path>
    </svg>
  );
};

const ThreeDotsIcon = () => {
  return [...Array(3)].map((_, i) => (
    <div className="w-1.5 h-1.5 bg-white rounded-full" key={i} />
  ));
};
