/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import Loader from "../components/loader";
import api from "../services/api";
import { setUser } from "../redux/auth/actions";

export default () => {
  const [values, setValues] = useState();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/admin/${user._id}`);
      setValues(data);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/${user._id}`, values);
      if (!res.ok) throw new Error(res);
      dispatch(setUser(res.data));
      toast.success("Votre profil a été mis à jour");
    } catch (error) {
      console.log("error", error);
    }
  };

  if (!values) return <Loader />;

  return (
    <div className="p-5 max-w-5xl w-full mx-auto">
      <section className="bg-white p-5 rounded-lg">
        <h2 className="text-xl font-bold mb-5">Mon compte</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="w-full"
              placeholder="Entrez le nom de votre association"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="organization-email">Adresse e-mail</label>
            <input
              type="email"
              name="organization-email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="w-full"
              placeholder="Entrez votre adresse e-mail"
            />
          </div>

          <button type="submit" className="py-3 px-6 rounded-lg bg-primary text-white !mt-6">
            Mettre à jour
          </button>
        </form>
      </section>
    </div>
  );
};
