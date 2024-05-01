import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { LinkIcon, ClipboardIcon } from "src/components/icons";
import { PlusIcon } from "src/components/icons";
import Loader from "src/components/loader";
import { Modal } from "src/components/modal";

import { useModal } from "src/hooks";
import api from "src/services/api";
import { appURL } from "../../config";
import { hotjar } from "react-hotjar";

export const Equipe = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState();
  const { isOpen, closeModal, openModal } = useModal();

  const location = useLocation();

  useEffect(() => {
    if (hotjar.initialized()) {
      hotjar.stateChange(location);
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/user`);
      setUsers(data);
    })();
  }, []);

  if (!users) return <Loader />;

  return (
    <>
      <section className="p-4 rounded-lg bg-app space-y-2">
        <div className="flex lg:items-center lg:justify-between flex-col lg:flex-row gap-2">
          <h1 className="font-bold text-white">
            {users.length + " " + t("member.team")}
          </h1>
          <button
            className="px-4 py-2 flex items-center gap-x-2 font-bold text-white bg-app-button rounded-lg text-sm"
            onClick={openModal}
          >
            <PlusIcon />
            {t("member.invite")}
          </button>
        </div>
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead className="bg-app-card-bg">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-bold text-details-secondary"
                >
                  {t("member")}
                </th>
                <th
                  scope="col"
                  className="py-3 text-left text-xs font-bold text-details-secondary hidden lg:table-cell"
                >
                  {t("member.invitation_date")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7665A7] h-[20px] ">
              {users.map((member) => (
                <tr key={member._id}>
                  <td className="whitespace-nowrap lg:py-4 py-3">
                    <div className="flex items-center">
                      <div className="h-6 w-6 flex-shrink-0">
                        <img
                          className="h-6 w-6 rounded-full"
                          src={member.avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-white font-bold text-xs">
                          {member.name}
                        </div>
                        <div className="text-details-link text-xs">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 text-xs text-details-link hidden lg:table-cell">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <InviteMemberModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};

const InviteMemberModal = ({ isOpen, closeModal }) => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.Auth.user);
  const url = `${appURL}/auth/signup/${user.workspace_id}`;
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white text-center">
          {t("member.invite")}
        </h1>
        <p className="text-xs text-details-secondary text-center">
          {t("member.invitation_description")}
        </p>
        <div className="space-y-1">
          <label className="text-details-secondary text-xxs font-bold inline-block">
            {t("member.invitation_link")}
          </label>
          <div className="py-2 px-4 rounded bg-app-accent flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <LinkIcon />
              <p className="text-xs text-details-link">{url}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(url)}>
              <ClipboardIcon />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="py-2 w-1/3 rounded-lg text-white font-bold bg-[#4119B5]"
            onClick={closeModal}
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};
