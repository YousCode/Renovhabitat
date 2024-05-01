import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../../components/loader";
import Modal from "../../components/modal";
import formatDateToFrench from "../../utils/formatDateToFrench";
import api from "../../services/api";

export default () => {
  const [workspaces, setWorkspaces] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/workspace`);
      setWorkspaces(data);
    })();
  }, []);

  if (!workspaces) return <Loader />;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-black-100 flex items-center gap-x-4">
          Workspaces
        </h3>
        <Create />
      </div>
      <Table workspaces={workspaces} />
    </>
  );
};

const Table = ({ workspaces }) => {
  const thead = ["Nom de société", "Nombre d'utilisateurs", "Date de création"];

  return (
    <div className="flow-root col-span-10 bg-white rounded-lg border overflow-x-auto">
      <div className="inline-block min-w-full align-middle overflow-hidden">
        <table className="min-w-full w-full table-fixed">
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
            {workspaces.map((workspace) => (
              <Row workspace={workspace} key={workspace._id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = ({ workspace }) => {

  const history = useHistory();

  return (
    <tr className={`cursor-pointer hover:bg-slate-50 text-sm`} onClick={() => history.push(`/workspace/${workspace._id}`)}>
      <td className="py-3 px-4 text-black-90 capitalize">{workspace.name}</td>
      <td className="py-3 px-4 text-black-90">TODO</td>
      <td className="py-3 px-4 capitalize text-black-90">{workspace.created_at ? formatDateToFrench(workspace.created_at).slice(0, -7) : ""}</td>
    </tr>
  );
};

const Create = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const history = useHistory();

  const onSubmit = async () => {
    const { data } = await api.post(`/workspace`, { name });

    history.push(`/workspace/${data._id}`);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-primary py-3 px-6 text-sm rounded-md text-white">
        Nouvelle workspace
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl rounded-xl">
        <div className="p-6 ">
          <div className="text-xl font-bold mb-4">Créer une nouvelle workspace</div>
          <div className="mb-4">
            <div className="text-sm text-black/90 mb-2">Nom</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-lg w-full px-4 py-2" />
          </div>
          <button disabled={!name} onClick={onSubmit} className="bg-primary py-3 px-6 text-sm rounded-md text-white">
            Créer
          </button>
        </div>
      </Modal>
    </>
  );
};
