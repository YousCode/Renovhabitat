import { Fragment, useEffect, useState } from "react";
import { Popover, Transition, Menu } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CalendarIcon, PlusIcon, ClockIcon } from "src/components/icons";

import API from "src/services/api";
import { task_categories, task_category_colors} from "src/utils";


export const KanbanCard = ({
  task,
  people,
  projects,
  setTasks,
  setModalOpened,
  setTaskSelected,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState();
  
  const getDateDiff = () => {
  
    const currentDate = new Date();
    const endDate = values.endsAt ? new Date(values.endsAt) : null;

    if (!endDate) {
      return "-";
    }

    const diffInMilliseconds = endDate - currentDate;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return `${-diffInDays} J de retard`;
    }
    if (diffInDays === 0) {
      return "Aujourd'hui";
    }
    if (diffInDays === 1) {
      return "Demain";
    } else {
      return `${diffInDays} J Restants`;
    }
  };
  
  useEffect(() => {
    setValues(task);
  }, [task]);

  const handleComponentClick = (e) => {
    const noModal = e.target.getAttribute("noModal");
    if (noModal === null) {
      setTaskSelected(task);
      setModalOpened(true);
    }
  };

  if (!values) return null;
  return (
    <div
      className={`mt-2 p-2 p-md-4 rounded bg-app-card-bg w-72 w-md-96 space-y-2 space-y-md-4 border transition-colors border-transparent relative`}
      onClick={handleComponentClick}
    >
      <div className="flex justify-between items-start border-b border-placeholder">
      <div className="flex-1">
        <p className="text-xxs text-xs-md text-details-secondary">
          {t("task.title")}
        </p>
        <p className="text-lg font-semibold pb-2 ">
          {values.title ? values.title : t("task.without_title")}
        </p>
        </div>
        <div 
        className="bg-details-deadline p-1.5 rounded flex items-center mr-10" 
        title={values.endsAt ? new Date(values.endsAt).toLocaleDateString() : ""}
        >
        <ClockIcon className="text-details-deadline-text h-3" />
        <p className="ml-3 text-xs text-details-deadline-text font-bold">
            {getDateDiff()}
        </p>
    </div>

        <Menu as={Fragment}>
          <Menu.Button
            className="flex items-center justify-center gap-x-[3px] gap-x-md-[5px] w-7 w-md-8 h-6 h-md-8 border border-transparent hover:border-details-secondary rounded transition-all absolute top-2 right-2 bg-app-task-bg"
            noModal="true"
          >
            {[...Array(3)].map((_, i) => (
              <div
                className="w-1 w-md-1.5 h-1 h-md-1.5 bg-details-secondary rounded-full"
                key={i}
                noModal="true"
              />
            ))}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute z-50 top-8 right-2 mt-1 w-32 origin-top-right divide-y divide-[#291C4B] rounded bg-app-accent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                        const { data } = await API.put(`/task/${task._id}`, {
                          ...values,
                          status:
                            task.status === "A faire"
                              ? "Clôturé"
                              : "A faire",
                        });
                        setTasks();
                      }}
                    >
                      {task.status === "A faire"
                        ? t("task.close")
                        :  t("task.reopen")
                    }
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to={`/projects/${task.projectId}`}
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
                        const { ok } = await API.remove(`/task/${task._id}`);
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
      </div>

      <div className="space-y-px">
        <p className="text-xxs text-xs-md text-details-secondary">
          {t("category")}
        </p>
        <Popover>
          <div className="relative z-40" noModal="true">
            <Popover.Button className="flex items-center text-xs text-sm-md rounded bg-app-task-bg px-2 px-md-3 py-1 py-md-2 justify-center">
            <div className={`mr-2 w-1.5 h-1.5 rounded-full ${task_category_colors[task.category]?.bg || 'bg-tertiary'}`} />

              <p className={`text-xs font-bold ${task_category_colors[task.category]?.text || 'text-tertiary'}`}>
                {values.category
                  ? t(`task.category.${values.category}`)
                  : t("task.assign_category")}
              </p>
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
              <Popover.Panel
                className="absolute max-h-60 overflow-y-auto  right-0 mt-2 w-full origin-top-right rounded-md bg-[#160E2D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-2"
                noModal="true"
              >
                {task_categories.map((category, i) => (
                  <label
                    key={i}
                    className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors px-2 py-1"
                    noModal="true"
                  >
                    <input
                      type="radio"
                      className="h-3 w-3 rounded-full border border-details-link bg-transparent !ring-0 !outline-0 text-details-link"
                      value={category}
                      name="category"
                      onClick={async () => {
                        const { data } = await API.put(`/task/${task._id}`, {
                          ...values,
                          category: category,
                        });
                        setValues(data);
                      }}
                      noModal="true"
                    />
                    {t(`task.category.${category}`)}
                  </label>
                ))}
              </Popover.Panel>
            </Transition>
          </div>
        </Popover>
      </div>

      <div className="space-y-px">
        <p className="text-xxs text-details-secondary">{t("project")}</p>

        <Popover>
          <div className="relative z-30">
            <Popover.Button className="flex items-center gap-x-2 text-xs underline text-white">
              {values.projectId ? values.projectName : "Assigner un projet"}
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
              <Popover.Panel
                className="absolute max-h-60 overflow-y-auto  right-0 mt-2 w-full origin-top-right rounded-md bg-[#160E2D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-2"
                noModal="true"
              >
                {/* if projects length 0 a link that redirects to creating a project */}
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
                    className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors px-2 py-1"
                    key={i}
                    noModal="true"
                  >
                    <input
                      type="radio"
                      className="h-3 w-3 rounded-full border border-details-link bg-transparent !ring-0 !outline-0 text-details-link"
                      name="project"
                      onClick={async () => {
                        const { data } = await API.put(`/task/${task._id}`, {
                          ...values,
                          projectId: project._id,
                          projectName: project.name,
                          projectCategory: project.category,
                        });
                        setValues(data);
                      }}
                      noModal="true"
                    />
                    {project.name}
                  </label>
                ))}
              </Popover.Panel>
            </Transition>
          </div>
        </Popover>
      </div>

      <div className="space-y-px">
        <p className="text-xxs text-details-secondary">
          {t("task.assigned_person")}
        </p>

        <Popover>
          <div className="relative z-20">
            <Popover.Button className="py-2 bg-placeholder rounded-md flex items-center w-full ring-1 ring-transparent hover:ring-details-secondary transition-all">
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
              <Popover.Panel
                className="absolute space-y-2.5 right-0 mt-2 w-full origin-top-right rounded-md bg-[#160E2D] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2"
                noModal="true"
              >
                {people.map((person, i) => (
                  <label
                    className="w-full text-xs text-details-link flex items-center gap-x-2 hover:bg-app transition-colors"
                    key={i}
                    noModal="true"
                  >
                    <input
                      type="radio"
                      name="assignedTo"
                      className="h-3 w-3 rounded-full border border-details-link bg-transparent !ring-0 !outline-0 text-details-link"
                      onClick={async (e) => {
                        const { data } = await API.put(`/task/${task._id}`, {
                          ...values,
                          assignedId: person._id,
                          assignedName: person.name,
                          assignedAvatar: person.avatar,
                        });
                        setValues(data);
                      }}
                      noModal="true"
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
        <p className="text-xxs text-details-secondary">Start Date</p>
        <div>
          <div className="relative">
            <CalendarIcon
              className="w-4 w-md-6 h-4 h-md-6 text-details-secondary absolute top-1/2 -translate-y-1/2 left-2.5 left-md-3.5 z-10"
              noModal="true"
            />
            <input
              type="text"
              value={
                values.startsAt instanceof Date
                  ? values.startsAt.toISOString().slice(0, 10)
                  : new Date(values.startsAt).toISOString().slice(0, 10)
              }
              placeholder="Ajouter une date"
              className="pl-10 pl-md-14 bg-placeholder text-xs text-sm-md rounded-md w-full text-details-link ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none cursor-pointer placeholder:text-details-link pr-10 pr-md-14"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={async (e) => {
                const date = new Date(e.target.value);

                await API.put(`/task/${task._id}`, {
                  ...values,
                  startsAt: e.target.value,
                });

                setValues({ ...values, startsAt: date });
              }}
              noModal="true"
            />
          </div>
        </div>
      </div>
      <div className="space-y-px">
        <p className="text-xxs text-details-secondary">End Date</p>
        <div>
          <div className="relative">
            <CalendarIcon
              className="w-4 w-md-6 h-4 h-md-6 text-details-secondary absolute top-1/2 -translate-y-1/2 left-2.5 left-md-3.5 z-10"
              noModal="true"
            />
            <input
              type="text"
              value={
                values.endsAt instanceof Date
                  ? values.endsAt.toISOString().slice(0, 10)
                  : new Date(values.endsAt).toISOString().slice(0, 10)
              }
              placeholder="Ajouter une date"
              className="pl-10 pl-md-14 bg-placeholder text-xs text-sm-md rounded-md w-full text-details-link ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none cursor-pointer placeholder:text-details-link pr-10 pr-md-14"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              onChange={async (e) => {
                const date = new Date(e.target.value);

                await API.put(`/task/${task._id}`, {
                  ...values,
                  endsAt: e.target.value,
                });

                setValues({ ...values, endsAt: date });
              }}
              noModal="true"
            />
          </div>
        </div>
      </div>

      <div className="space-y-px">
        <p className="text-xxs text-details-secondary">Notes</p>
        <textarea
          rows={4}
          value={values.notes ?? ""}
          disabled={true}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
          placeholder="Ajouter des notes"
          className="bg-app-accent text-xs text-sm-md rounded-md w-full text-details-link ring-1 ring-transparent hover:ring-details-secondary transition-colors border-none placeholder:text-details-link disabled:hover:ring-transparent resize-none"
        />
      </div>
    </div>
  );
};
