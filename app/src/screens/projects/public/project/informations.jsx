import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { BiChevronDown, BiHistory } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { HiOutlinePencilAlt } from "react-icons/hi";

export const Informations = ({ data }) => {
  const { t } = useTranslation();
  const [values] = useState(data);

  return (
    <div className="space-y-2">
      <Disclosure as="div" className="lg:p-4 p-3 bg-[#49367C] rounded">
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex items-center justify-between w-full border-b transition-colors ${
                open
                  ? "pb-2 border-details-secondary text-white"
                  : "border-transparent text-app-light"
              }`}
            >
              <div className="flex items-center gap-x-2">
                <HiOutlinePencilAlt size={20} />
                <p className="text-sm font-semibold">
                  {t("projects.informations.detail")}
                </p>
              </div>
              <BiChevronDown
                size={20}
                className={`${open && "rotate-180"} transition`}
              />
            </Disclosure.Button>
            <Disclosure.Panel as="div" className="mt-2">
              <p className="text-details-secondary text-xs">
                <span className="font-semibold">{t("project.name")} : </span>
                {values.name}
              </p>
              <p className="text-details-secondary text-xs">
                <span className="font-semibold">{t("category")} : </span>
                {t(`project.category.${values.category}`)}
              </p>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure as="div" className="lg:p-4 p-3 bg-[#49367C] rounded">
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex items-center justify-between w-full border-b transition-colors ${
                open
                  ? "pb-2 border-details-secondary text-white"
                  : "border-transparent text-app-light"
              }`}
            >
              <div className="flex items-center gap-x-2">
                <BiHistory size={20} />
                <p className="text-sm font-semibold">
                  {t("projects.informations.history")}
                </p>
              </div>
              <BiChevronDown
                size={20}
                className={`${open && "rotate-180"} transition`}
              />
            </Disclosure.Button>
            <Disclosure.Panel as="div" className="mt-2">
              <p className="text-details-secondary text-xs">
                <span className="font-semibold">
                  {t("projects.informations.creation")}
                </span>
                {new Date(values.createdAt).toISOString().slice(0, 10)}
              </p>
              <p className="text-details-secondary text-xs">
                <span className="font-semibold">{t("category")} : </span>
                {t(`project.category.${values.category}`)}
              </p>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
