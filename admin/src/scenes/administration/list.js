import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../../components/loader";
import Modal from "../../components/modal";
import formatDateToFrench from "../../utils/formatDateToFrench";
import api from "../../services/api";

export default () => {
  const [admins, setAdmins] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/admin`);
      setAdmins(data);
    })();
  }, []);

  if (!admins) return <Loader />;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-black-100 flex items-center gap-x-4">
          Administrateurs
          <span className="text-sm font-medium text-black-90">{admins.length} administrateurs</span>
        </h3>
        <Create />
      </div>
      <Table data={admins} />
    </>
  );
};

const Table = ({ data }) => {
  const thead = ["Nom", "Email", "	Date de création"];
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
            {data.map((data) => (
              <Row data={data} key={data._id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = ({ data }) => {
  const history = useHistory();

  return (
    <tr className={`cursor-pointer hover:bg-slate-50 text-sm`} onClick={() => history.push(`/dataistration/${data._id}`)}>
      <td className="py-3 px-4 text-black-90 capitalize">{data.name}</td>
      <td className="py-3 px-4 text-black-90">{data.email}</td>
      <td className="py-3 px-4 capitalize text-black-90">{data.created_at ? formatDateToFrench(data.created_at).slice(0, -7) : ""}</td>
    </tr>
  );
};

const Create = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "Abc123$$",
  });

  const history = useHistory();

  const onSubmit = async () => {
    const { data } = await api.post(`/admin`, values);
    toast.success("Administrateur créé");
    history.push(`/administration/${data._id}`);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-primary py-3 px-6 text-sm rounded-md text-white">
        Créer un administrateur
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl rounded-xl">
        <div className="p-6 ">
          <div className="text-xl font-bold mb-4">Créer une nouvelle administrateur</div>
          <div className="mb-4">
            <div className="text-sm text-black/90 mb-2">Nom</div>
            <input
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="border border-gray-300 rounded-lg w-full px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <div className="text-sm text-black/90 mb-2">Email</div>
            <input
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="border border-gray-300 rounded-lg w-full px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <div className="text-sm text-black/90 mb-2">Mot de passe</div>
            <input
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className="border border-gray-300 rounded-lg w-full px-4 py-2"
            />
          </div>
          <button
            disabled={!values.name || !values.email || !values.password}
            onClick={onSubmit}
            className="bg-primary py-3 px-6 text-sm rounded-md text-white"
          >
            Créer
          </button>
        </div>
      </Modal>
    </>
  );
};
