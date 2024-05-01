import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { BiSolidUser, BiChevronDown, BiImage } from "react-icons/bi";
import {
  AiOutlineLoading,
  AiOutlineDelete,
  AiOutlineDownload,
} from "react-icons/ai";
import { BsChatLeftTextFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { AiFillLock } from "react-icons/ai";
import { CopyIcon } from "src/components/icons";

import api from "src/services/api";
import { readFileAsync } from "src/utils";

export const Suivi = ({ data }) => {
  const [values, setValues] = useState(data);

  return (
    <div className="lg:col-span-4 space-y-2 row-start-1 lg:row-start-auto">
      <Client values={values} />
      <Comment />
      <Media data={values} />
    </div>
  );
};

const Client = ({ values }) => {
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put(`/project/${values._id}`, values);
    toast.success(t("projects.suivi.modified"));
  };

  const copyToClipboard = async (text) => { 
      await navigator.clipboard.writeText(text);
      toast.success(t("projects.suivi.copied"));
      };
  
  return (
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
              <BiSolidUser size={20} />
              <p className="text-sm font-semibold">
                {t("projects.suivi.customer")}
              </p>
            </div>
            <BiChevronDown
              size={20}
              className={`${open && "rotate-180"} transition`}
            />
          </Disclosure.Button>
          <Disclosure.Panel as="div">
            <form onSubmit={handleSubmit} className="space-y-2.5 mt-2.5">
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="client-name"
                  className="text-xxs text-details-secondary pl-2"
                >
                  {t("projects.suivi.customer_manager")}
                </label>
                <input
                  id="client-name"
                  type="text"
                  readOnly
                  value={values.clientName}
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-details-secondary placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="email"
                  className="text-xxs text-details-secondary pl-2"
                  readOnly
                >
                  {t("projects.suivi.email")}
                </label>
                <div className="relative bg-app-card-secondary rounded-md">
                <input
                  id="email"
                  type="email"
                  value={values.clientEmail}
                  readOnly
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-details-secondary placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                />
                <button
                  onClick={() => copyToClipboard(values.clientEmail)}
                  className="absolute inset-y-0 right-2 flex items-center text-xs bg-transparent p-1 rounded"
                >
                  <CopyIcon />
                </button>
              </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="telephone"
                  className="text-xxs text-details-secondary pl-2"
                >
                  {t("phone")}
                </label>
                <div className="relative bg-app-card-secondary rounded-md">
                <input
                  id="telephone"
                  type="tel"
                  value={values.clientPhone}
                  readOnly
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-details-secondary placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                />
                <button
                  onClick={() => copyToClipboard(values.clientPhone)}
                  className="absolute inset-y-0 right-2 flex items-center text-xs bg-transparent p-1 rounded"
                >
                  <CopyIcon />
                </button>
              </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="production"
                  className="text-xxs text-details-secondary pl-2"
                >
                  {t("projects.suivi.production")}
                </label>
                <input
                  id="production"
                  type="text"
                  value={values.productionName}
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-details-secondary placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                  readOnly
                />
              </div>
              <button
                type="submit"
                className="font-semibold text-white py-2 px-3 w-full rounded bg-details-secondary"
              >
                {t("edit")}
              </button>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

const Comment = () => {
  const { t } = useTranslation();

  return (
    <Disclosure as="div" className="lg:p-4 p-3 bg-[#49367C] rounded">
      {({ open }) => (
        <>
          <Disclosure.Button
            disabled
            className={`flex items-center justify-between w-full border-b transition-colors ${
              open
                ? "pb-2 border-details-secondary text-white"
                : "border-transparent text-app-light"
            }`}
          >
            <div className="flex items-center gap-x-2 justify-between w-full">
              <div className="flex items-center gap-x-2">
                <BsChatLeftTextFill size={20} />
                <p className="text-sm font-semibold">
                  {t("projects.suivi.messages")}
                </p>
              </div>

              <AiFillLock size={16} />
            </div>

            <BiChevronDown
              size={20}
              className={`${open && "rotate-180"} transition`}
            />
          </Disclosure.Button>
        </>
      )}
    </Disclosure>
  );
};

const Media = ({ data }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: m } = await api.get(`/media?project_id=${data._id}`);
    setMedias(m);
  };

  const handleFileChange = async (e) => {
    if (loading) return;
    setLoading(true);

    try {
      const f = e.target.files[0];
      const rawBody = await readFileAsync(f);
      const obj = { rawBody, name: f.name };
      obj.project_id = data._id;
      obj.project_name = data.name;

      await api.post(`/media`, obj);
      toast.success(t("projects.suivi.modified"));
      await load();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure ?")) return;
    const { ok } = await api.remove(`/media/${id}`);
    if (!ok) return toast.error("Error while deleting media!");
    await load();
    toast.success("Media deleted!");
  };


  return (
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
              <BiImage size={20} />
              <p className="text-sm font-semibold">
                {t("projects.suivi.media")}
              </p>
            </div>
            <BiChevronDown
              size={20}
              className={`${open && "rotate-180"} transition`}
            />
          </Disclosure.Button>
          <Disclosure.Panel as="div" className="py-2">
            <div className="grid grid-cols-4 bg-app-accent rounded px-3 py-1.5 gap-5">
              <p className="text-sm font-semibold text-placeholder">
                {t("projects.suivi.name_movie")}
              </p>
              <p className="text-sm font-semibold text-placeholder">Date</p>
              <p className="text-sm font-semibold text-placeholder">
                {t("projects.suivi.file")}
              </p>
            </div>
            <div className="space-y-2 mt-2.5">
              {medias.map((media) => (
                <div className="p-1 rounded bg-[#38266B]">
                  <div className="grid grid-cols-4 gap-4">
                    <p className="text-xs text-details-secondary truncate my-auto pl-2">
                      {media.name}
                    </p>
                    <p className="text-xs text-details-secondary truncate my-auto">
                      {new Date(media.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-details-secondary truncate my-auto">
                      {media.extension}
                    </p>

                    <div className="text-base text-details-secondary ml-auto flex items-center space-x-2">
                      <a
                        href={media.url}
                        download
                        target="_blank"
                        className="px-2 bg-app-accent rounded h-full py-3"
                      >
                        <AiOutlineDownload />
                      </a>
                      <button
                        className="cursor-pointer px-2 bg-app-accent rounded h-full py-3"
                        onClick={async () => await handleDelete(media._id)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <label
              className={`${
                loading && "opacity-50 cursor-not-allowed"
              } py-2 px-4 mt-2 text-center cursor-pointer w-full rounded bg-details-secondary text-white font-bold flex items-center justify-center`}
            >
              {loading && <AiOutlineLoading className="animate-spin mr-2" />}
              Ajouter
              <input type="file" hidden onChange={handleFileChange} />
            </label>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
