import { Link, useHistory } from "react-router-dom";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { Menu, Transition } from "@headlessui/react";
import { ClockIcon } from "src/components/icons";
import API from "src/services/api";
import { task_category_colors } from 'src/utils';

const getDateDiff = (date) => {
  const diff = new Date(date) - new Date();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return -days + "J de retard";
  }
  if (days === 0) {
    return "Aujourd'hui";
  }
  if (days === 1) {
    return "Demain";
  } else {
    return days + " J Restants";
  }
};

export const ProjectCard = ({ data, getProjects }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Link
      to={`/projects/${data._id}`}
      className="flex bg-app-card-bg rounded lg:divide-x lg:divide-y-0 divide-y divide-app-card-border px-4 py-3 lg:flex-row flex-col"
    >
      <div className="grid lg:grid-cols-12 items-center gap-y-2 lg:divide-x lg:divide-y-0 divide-y divide-app-card-border flex-1">
        <p className="text-white font-bold underline block lg:col-span-2 truncate">
          {data.name}
        </p>

        <div className="space-y-2 lg:px-6 lg:col-span-2">
          <p className="text-xs text-details-secondary font-bold">Deadline</p>
          <div className="bg-details-deadline p-1.5 rounded flex items-center"
          title={new Date(data.endAt).toLocaleDateString()}
          >
            <ClockIcon className="text-details-deadline-text h-3" />
            <p className=" ml-3 text-xs text-details-deadline-text font-bold">
              {data.endAt ? getDateDiff(data.endAt) : "-"}
            </p>
          </div>
        </div>

        <div className="space-y-1 lg:col-span-8 lg:px-6 h-full w-full flex flex-col justify-center">
          <p className="text-xs text-details-secondary font-bold w-full">
            {t("tasks.current")} ({data?.tasks?.length})
          </p>
          {data?.tasks?.length > 0 && (
            <div className="flex items-center gap-1 overflow-hidden flex-wrap">
              {data?.tasks.map((task, i) => (
                <div
                  key={i}
                  className="rounded bg-app-task-bg p-2 flex justify-center items-center"
                >
                <div className={`mr-2 w-1.5 h-1.5 rounded-full ${task_category_colors[task.category]?.bg || 'bg-tertiary'}`} />
                <p className={`text-xs font-bold ${task_category_colors[task.category]?.text || 'text-tertiary'}`}>
                    {t(`task.category.${task.category}`)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center pl-4">
        <Menu as={Fragment}>
          <Menu.Button
            className="flex items-center justify-center gap-1  border border-transparent hover:border-details-secondary rounded transition-all bg-app px-2.5 h-full"
            noModal="true"
          >
            {[...Array(3)].map((_, i) => (
              <div
                className="w-1 h-1 bg-details-secondary rounded-full"
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
              className="absolute z-50 right-0 mt-1 w-32 top-full divide-y divide-[#291C4B] rounded bg-app-accent shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
              noModal="true"
            >
              <div className="px-1 py-1" noModal="true">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`group flex text-xs w-full items-center justify-center rounded-sm px-2 py-1 text-details-secondary ${active && "bg-app-background"
                        } transition-colors`}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (data) {
                          const updatedData = {
                            ...data,
                            status:
                              data.status === "Cloturé"
                                ? "En cours"
                                : "Cloturé",
                          };
                          const encodedId = encodeURIComponent(data._id);
                          await API.put(`/project/${encodedId}`, updatedData);
                          getProjects();
                        }
                      }}
                      noModal="true"
                    >
                      {data.status === "Cloturé"
                        ? t("projects.reopen")
                        : t("projects.close")}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`group flex text-xs w-full items-center justify-center rounded-sm px-2 py-1 text-details-secondary ${active && "bg-app-background"
                        } transition-colors border-t border-[#291C4B]`}
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!window.confirm("Are you sure ?")) return;
                        if (data) {
                          const encodedId = encodeURIComponent(data._id);
                          await API.remove(`/project/${encodedId}`);
                          getProjects();
                        }
                      }}
                      noModal="true"
                    >
                      {t("projects.delete")}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </Link>
  );
};
