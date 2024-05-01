import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useHistory, Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";

import Loader from "../../components/loader";
import Modal from "../../components/modal";

import formatDateToFrench from "../../utils/formatDateToFrench";
import api from "../../services/api";

export default () => {
  const [workspace, setWorkspace] = useState();
  const [values, setValues] = useState({});

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/workspace/${id}`);
        setWorkspace(data);
        setValues(data);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, [id]);

  const onUpdate = async () => {
    const { data } = await api.put(`/workspace/${id}`, values);
    toast.success("Updated!");
    history.push("/workspace");
  };

  const onDelete = async () => {
    if (!confirm("Are you sure?")) return;
    const { data } = await api.remove(`/workspace/${id}`);
    toast.success("Delete!");
    history.push("/workspace");
  };

  if (!workspace) return <Loader />;

  return (
    <>
      <div className="flex items-center gap-x-4 mb-6">
        <button className="bg-primary/10" onClick={() => history.goBack()}>
          <HiChevronLeft className="text-primary" size={32} />
        </button>
        <h3 className="text-2xl font-bold text-black-100 flex items-center gap-x-4">{workspace.name}</h3>
      </div>
      <div className="grid grid-cols-12 w-full space-x-4">
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black-90">Nom</label>
                <input
                  className="input w-full"
                  placeholder="Partenariat évènement, partenariat principal"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <button className="bg-primary py-3 px-6 text-sm rounded-md text-white" onClick={onUpdate}>
                  Modifier
                </button>
                <button className="bg-red-500 py-3 px-6 text-sm rounded-md text-white" onClick={onDelete}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-10">
          <div className="bg-white rounded-lg border mb-2 divide-y">
            <div className="py-4 px-5 space-y-1">
              <p className="text-sm text-black-100 font-semibold">Date de création :</p>
              <p className="text-sm text-black-90 capitalize">{formatDateToFrench(workspace.created_at)}</p>
            </div>
            <div className="py-4 px-5">
              <p className="text-sm text-black-100 font-semibold">Nombre de membres :</p>
              <Link className="text-sm text-primary underline" to={`/user?workspace_id=${workspace._id}`}>
                {"TODO"} (voir tous)
              </Link>
            </div>
          </div>
          <Invite workspace={workspace} />
        </div>
      </div>
    </>
  );
};

const Invite = ({ workspace }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ name: "", email: "" });

  const onSubmit = async () => {
    values.workspace_id = workspace._id;
    values.workspace_name = workspace.name;
    const { data } = await api.post(`/user/invite_user`, values);
    toast.success("Created!");
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="py-3 px-6 border border-primary text-sm text-primary font-bold rounded-lg">
       Inviter une nouvelle membre
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl rounded-xl">
        <div className="p-6 ">
          <div className="text-xl font-bold mb-4">Créer une nouvelle membre</div>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <button disabled={!values.name || !values.email} onClick={onSubmit} className="bg-primary py-3 px-6 text-sm rounded-md text-white">
            Envoyer
          </button>
        </div>
      </Modal>
    </>
  );
};
