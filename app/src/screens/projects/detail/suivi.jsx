import { useEffect, useRef, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { BiSolidUser, BiImage, BiChevronDown } from "react-icons/bi";
import { BsChatLeftTextFill } from "react-icons/bs";
import {
  AiOutlineLoading,
  AiOutlineDelete,
  AiOutlineDownload,
} from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RxAvatar } from "react-icons/rx";

import { MonthlyCalendar } from "./monthlyCalendar";
import api from "../../../services/api";
import { readFileAsync } from "../../../utils";

export const Suivi = ({ data, onChange }) => {
  return (
    <div className="grid lg:grid-cols-12 gap-5">
      <div className="lg:col-span-8 space-y-2">
        <MonthlyCalendar />
      </div>
      <div className="lg:col-span-4 space-y-2 row-start-1 lg:row-start-auto">
        <Client data={data} onChange={onChange} />
        <Media data={data} onChange={onChange} />
        <Comment project={data} />
      </div>
    </div>
  );
};

const Client = ({ data, onChange }) => {
  const { t } = useTranslation();

  const [values, setValues] = useState(data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put(`/project/${values._id}`, values);
    onChange(data);
    toast.success(t("projects.suivi.modified"));
  };

  return (
    <Disclosure as="div" className="lg:p-4 p-2 bg-app-card-bg rounded">
      {({ open }) => (
        <>
          <Disclosure.Button className="bg-placeholder border-transparent rounded w-full text-white py-2.5 px-4 flex items-center justify-between">
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
                  className="text-xxs text-details-secondary"
                >
                  {t("projects.suivi.customer_manager")}
                </label>
                <input
                  id="client-name"
                  type="text"
                  value={values.clientName}
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-white placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                  onChange={(e) =>
                    setValues({ ...values, clientName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="email"
                  className="text-xxs text-details-secondary"
                >
                  {t("projects.suivi.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={values.clientEmail}
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-white placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                  onChange={(e) =>
                    setValues({ ...values, clientEmail: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="telephone"
                  className="text-xxs text-details-secondary"
                >
                  {t("phone")}
                </label>
                <input
                  id="telephone"
                  type="tel"
                  value={values.clientPhone}
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-white placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                  onChange={(e) =>
                    setValues({ ...values, clientPhone: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="production"
                  className="text-xxs text-details-secondary"
                >
                  {t("projects.suivi.production")}
                </label>
                <input
                  id="production"
                  type="text"
                  value={values.productionName}
                  className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-white placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                  onChange={(e) =>
                    setValues({ ...values, productionName: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="py-2 px-4 rounded bg-placeholder text-white font-bold"
              >
                {t("save")}
              </button>
            </form>
          </Disclosure.Panel>
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
    <Disclosure as="div" className="lg:p-4 p-2 bg-app-card-bg rounded">
      {({ open }) => (
        <>
          <Disclosure.Button className="bg-placeholder border-transparent rounded w-full text-white py-2.5 px-4 flex items-center justify-between">
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
          <Disclosure.Panel as="div">
            <div className="space-y-2 py-2">
              {medias.map((media) => (
                <div className="flex items-center gap-x-5 p-3 bg-app rounded">
                  <div className="text-sm text-white truncate">
                    {media.name}
                  </div>
                  <div className="text-sm text-white">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-base text-white ml-auto flex items-center space-x-2">
                    <a href={media.url} download target="_blank">
                      <AiOutlineDownload />
                    </a>
                    <AiOutlineDelete
                      className="cursor-pointer"
                      onClick={async () => await handleDelete(media._id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <label
              className={`${loading && "opacity-50 cursor-not-allowed"
                } py-2 px-4 mt-2 text-center cursor-pointer w-full rounded bg-placeholder text-white font-bold flex items-center justify-center`}
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

const Comment = ({ project }) => {
  const { t } = useTranslation();

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const commentRef = useRef();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (commentRef && commentRef.current)
      commentRef.current.scroll({
        top: commentRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [comments.length]);

  const load = async () => {
    const { data, ok } = await api.get(`/comment?project_id=${project._id}`);
    if (!ok) return;
    setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    const { data } = await api.post("/comment", {
      message: newComment,
      project_id: project._id,
    });
    setNewComment("");
    toast.success("Comment added!");
    await load();
  };

  return (
    <Disclosure as="div" className="lg:p-4 p-2 bg-app-card-bg rounded">
      {({ open }) => (
        <>
          <Disclosure.Button className="bg-placeholder border-transparent rounded w-full text-white py-2.5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <BsChatLeftTextFill size={20} />
              <p className="text-sm font-semibold">
                {t("projects.suivi.messages")}
              </p>
            </div>
            <BiChevronDown
              size={20}
              className={`${open && "rotate-180"} transition`}
            />
          </Disclosure.Button>
          <Disclosure.Panel as="div">
            <div className="space-y-2.5 mt-2.5 w-full">
              <div className="flex flex-col gap-y-1 overflow-auto max-h-96">
                {(comments || []).map((comment, index) => (
                  <div className="w-full">
                    <div className="w-full flex gap-x-3 mb-2">
                      <RxAvatar className="h-6 w-6 rounded-full border border-details-secondary shadow-sm" />
                      <div className="w-full">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <div className="text-xs font-semibold text-details-secondary">
                              {comment.user_name}
                            </div>
                            <div className="text-xxs text-details-secondary italic">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              const { ok } = await api.remove(
                                `/comment/${comment._id}`,
                              );

                              if (!ok) {
                                toast.error("Error while deleting comment!");
                                return;
                              }

                              await load();

                              toast.success("Comment deleted!");
                            }}
                            className="text-xxs text-details-secondary hover:text-red-500 transition-colors mr-2f"
                          >
                            x
                          </button>
                        </div>
                        <div className="text-xs text-details-secondary mt-1">
                          {comment.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex flex-col gap-y-1">
                  <textarea
                    className="p-2.5 border-none rounded-md w-full bg-app-card-secondary text-xs text-details-secondary placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent focus:ring-details-secondary transition-colors"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                    }}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="py-2 px-4 rounded bg-placeholder text-white font-bold"
                    onClick={handleSubmit}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
