/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Loader from "src/components/loader";
import API from "src/services/api";
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { i18n } = useTranslation();
  const [values, setValues] = useState();

  const { t } = useTranslation();

  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    (async () => {
      const { data, ok } = await API.get(`/user/${user._id}`);
      if (!ok) return;
      setValues(data);
    })();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok } = await API.put(`/user/${user._id}`, values);
    if (!ok) return;
    i18n.changeLanguage(values.language);
    toast.success("Votre compte a bien été mis à jour");
  };

  if (!values) return <Loader />;

  return (
    <div className="p-6 max-w-5xl w-full mx-auto  rounded-lg">
      <section className="relative">
        <h2 className="text-2xl font-bold text-white  mb-4">
          {" "}
          {t("account.my_account")}
        </h2>
        <form
          className="grid grid-cols-2 gap-x-2.5 gap-y-4"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1">
            <label
              className="text-xxs font-bold text-details-secondary block"
              htmlFor="name"
            >
              {t("account.name")}
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm font-bold text-white placeholder:text-details-secondary px-4 h-11"
              placeholder="Entrez le nom de votre association"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-xxs font-bold text-details-secondary block"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              readOnly
              className="bg-app-card-secondary border-transparent rounded w-full text-sm font-bold text-white placeholder:text-details-secondary px-4 h-11"
            />
          </div>

          {/* language */}
          <div className="space-y-1">
            <label
              className="text-xxs font-bold text-details-secondary block"
              htmlFor="language"
            >
              {t("account.language")}
            </label>
            <select
              name="language"
              value={values.language}
              onChange={(e) => {
                setValues({ ...values, language: e.target.value });
              }}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm font-bold text-white placeholder:text-details-secondary px-4 h-11"
            >
              <option value="fr">{t("account.french")}</option>
              <option value="en">{t("account.english")}</option>
            </select>
          </div>

          {/* email not changable */}
          <button
            type="submit"
            className="w-1/3 col-span-2 text-white font-bold rounded bg-[#4119B5] py-3 px-4 "
          >
            {t("account.update")}
          </button>
        </form>
      </section>
    </div>
  );
};
