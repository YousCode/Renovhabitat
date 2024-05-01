import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useHistory, Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";

import Loader from "../../components/loader";

import formatDateToFrench from "../../utils/formatDateToFrench";
import api from "../../services/api";
import { appURL } from "../../config";

export default () => {
  const [user, setUser] = useState();
  const [values, setValues] = useState({});

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/user/${id}`);
        setUser(data);
        setValues(data);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, [id]);

  const onUpdate = async () => {
    const { data } = await api.put(`/user/${id}`, values);
    toast.success("Updated!");
    history.push("/user");
  };

  const onDelete = async () => {
    if (!confirm("Are you sure?")) return;
    const { data } = await api.remove(`/user/${id}`);
    toast.success("Delete!");
    history.push("/user");
  };

  if (!user) return <Loader />;

  return (
    <>
      <div className="flex items-center gap-x-4 mb-6">
        <button className="bg-primary/10" onClick={() => history.goBack()}>
          <HiChevronLeft className="text-primary" size={32} />
        </button>
        <h3 className="text-2xl font-bold text-black-100 flex items-center gap-x-4">
          User - {user.name}
        </h3>
      </div>
      <div className="grid grid-cols-12 w-full gap-x-4">
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black-90">Nom</label>
                <input
                  className="input w-full"
                  placeholder="Partenariat évènement, partenariat principal"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="bg-primary py-3 px-6 text-sm rounded-md text-white"
                  onClick={onUpdate}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 py-3 px-6 text-sm rounded-md text-white"
                  onClick={onDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black-90">Nom</label>
              <input
                className="input w-full"
                placeholder="Partenariat évènement, partenariat principal"
                value={values.email}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-2">
          <div className="bg-white rounded-lg border mb-2 divide-y">
            <div className="py-4 px-5 space-y-1">
              <Link
                className="text-sm text-primary underline"
                to={`/workspace/${user.workspace_id}`}
              >
                {user.workspace_name}
              </Link>
            </div>
            <div className="py-4 px-5 space-y-1">
              <p className="text-sm text-black-100 font-semibold">
                Date d’inscription :
              </p>
              <p className="text-sm text-black-90 capitalize">
                {formatDateToFrench(user.created_at)}
              </p>
            </div>
          </div>
          <a href={`${appURL}/connect?user_id=${user._id}&token=${api.getToken()}`} target="_blank" className="inline-block py-3 px-6 border border-primary text-sm text-primary font-bold rounded-lg">
            Login as
          </a>
        </div>
      </div>
    </>
  );
};
