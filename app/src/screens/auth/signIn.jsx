import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { hotjar } from "react-hotjar";

import { setUser } from "../../redux/auth/actions";

import API from "../../services/api";

export const SignIn = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  const send = async (e) => {
    e.preventDefault();
    try {
      const { user: u, token } = await API.post(`/user/signin`, values);
      console.log("user", u);
      if (u) {
        dispatch(setUser(u));
        if (hotjar.initialized()) {
          hotjar.identify(u._id, { name: u.name });
        };
      };
      if (token) API.setToken(token);
    } catch (e) {
      console.log("e", e);
      toast.error(e.code);
    }
  };

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="max-w-sm mx-auto text-white py-12 flex items-center justify-center min-h-screen flex-col">
      <div className="bg-[#100924] p-10 rounded-lg w-full">
        <h1 className="mb-4 font-semibold text-4xl text-center text-transparent bg-gradient-to-l from-[#7537c7] to-[#c957db] bg-clip-text">
          Hello !
        </h1>
        <div className="space-y-8">
          {/* <p className="text-center text-sm">
            Vous n'avez pas encore de compte ? <br />
            <Link className="text-[#c2a6ff] underline" to="#">
              Rendez-vous sur ce formulaire.
            </Link>
          </p> */}
          <form onSubmit={send} className="space-y-4">
            <input
              name="email"
              value={values.email || ""}
              placeholder={t("signin.enter_email")}
              aria-label={t("signin.enter_email")}
              className="bg-app-card-secondary border-app-card-bg rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              value={values.password || ""}
              placeholder={t("signin.enter_password")}
              aria-label={t("signin.enter_password")}
              className="bg-app-card-secondary border-app-card-bg rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="flex items-center justify-between py-2 px-4 rounded bg-app w-full text-sm font-bold text-white bg-[linear-gradient(90deg,#7a3cc9,#c957db)] group"
            >
              {t("signin.connexion")}
              <span className="text-2xl group-hover:translate-x-2 mr-2 transition-transform">
                →
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
