import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../../components/loader";

import formatDateToFrench from "../../utils/formatDateToFrench";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    (async () => {
      const { data, ok } = await api.post(`/user/search`);
      if (!ok) toast.error("Une erreur est survenue");
      console.log(data);
      setUsers(data);
    })();
  }, []);

  if (!users) return <Loader />;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-black-100 flex items-center gap-x-4">
          Users
        </h3>
      </div>
      <Table users={users} />
    </>
  );
};

const Table = ({ users }) => {
  const thead = [
    "Nom",
    "Workspace",
    "Dernière connexion",
    "Date d’inscription",
    "",
  ];

  return (
    <div className="flow-root col-span-10 bg-white rounded-lg border overflow-x-auto">
      <div className="inline-block min-w-full align-middle overflow-hidden">
        <table className="min-w-full w-full">
          <thead>
            <tr className="text-left text-xs !text-black-80 border-b border-black-30">
              {thead.map((e) => (
                <th className="py-3 px-4" key={e}>
                  <p className="font-normal">{e}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <Row data={user} key={user._id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = ({ data }) => {
  const [user, setUser] = useState(data);
  const history = useHistory();

  const renderAction = () => {
    if (user.status === "PENDING")
      return (
        <button
          onClick={async () => {
            const { data } = await api.post(`/workspace`, {
              name: user.workspace_name,
            });
            await api.put(`/user/${user._id}`, {
              status: "ACCEPTED",
              workspace_id: data._id,
              workspace_name: data.name,
            });
            setUser((state) => ({ ...state, status: "ACCEPTED" }));
            toast.success("Utilisateur accepté avec succès");
          }}
          className="py-2 px-4 bg-primary text-white rounded"
        >
          En cours
        </button>
      );
    return (
      <button className="py-2 px-4 bg-green-700 text-white rounded">
        Accepté
      </button>
    );
  };

  return (
    <tr
      className={`cursor-pointer hover:bg-slate-50 text-sm`}
      onClick={() => history.push(`/user/${user._id}`)}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-black-100">{user.name}</p>
            <p className="text-sm text-black-90">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-black-90 capitalize">
        {user.workspace_name}
      </td>
      <td className="py-3 px-4 text-black-90 capitalize">
        {formatDateToFrench(user.registered_at)}
      </td>
      <td className="py-3 px-4 text-black-90 capitalize">
        {formatDateToFrench(user.last_login_at)}
      </td>
      <td className="py-3 px-4 text-black-90 capitalize">
        <div
          className="flex items-center space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          {renderAction()}
        </div>
      </td>
    </tr>
  );
};
