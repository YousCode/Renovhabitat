import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useHistory } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import Loader from "../../components/loader";
import api from "../../services/api";

export default () => {
  const [admin, setAdmin] = useState();
  const [values, setValues] = useState({});

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/admin/${id}`);
        setAdmin(data);
        setValues(data);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, [id]);

  const onUpdate = async () => {
    const { data } = await api.put(`/admin/${id}`, values);
    toast.success("Updated!");
    history.push("/administration");
  };

  if (!admin) return <Loader />;

  return (
    <>
      <div className="flex items-center gap-x-4 mb-6">
        <button className="bg-primary/10" onClick={() => history.goBack()}>
          <HiChevronLeft className="text-primary" size={32} />
        </button>
        <h3 className="text-2xl font-bold text-black-100 flex items-center gap-x-4">
          Administration - {admin.name}
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
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <button
                  className="bg-primary py-3 px-6 text-sm rounded-md text-white"
                  onClick={onUpdate}
                >
                  Sauvegarder
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black-90">Email</label>
              <input
                type="email"
                className="input w-full"
                value={values.email}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
