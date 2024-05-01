import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";

import { setUser } from "../../redux/auth/actions";

import api from "../../services/api";

export default () => {
  const [seePassword, setSeePassword] = useState(false);
  const [values, setValues] = useState({
    email: "admin@yopmail.fr",
    password: "Abc123$$",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await api.post(`/admin/signin`, values);
      if (token) api.setToken(token);
      if (user) dispatch(setUser(user));
    } catch (e) {
      console.log("e", e);
      toast.error(e.code);
    }
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="bg-primary-off-white relative pb-10">
      <div className="mb-10 max-w-7xl mx-auto p-4"></div>

      <div className="flex items-center justify-center flex-col max-w-lg mx-auto w-full">
        <h1 className="text-center text-3xl font-semibold text-black mb-12">Se connecter</h1>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2">
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="w-full"
              placeholder="Entrez votre adresse e-mail"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <label for="password">Mot de passe</label>
              <Link className="text-primary leading-6" to="/auth/forgot">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                type={seePassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="w-full"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                {seePassword ? (
                  <BsEyeSlash size={18} className="text-primary cursor-pointer" onClick={() => setSeePassword(false)} />
                ) : (
                  <BsEye size={18} className="cursor-pointer" onClick={() => setSeePassword(true)} />
                )}
              </div>
            </div>
          </div>
          <button type="submit" className="py-3.5 w-full text-center bg-primary text-white rounded-lg !mt-12">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};
