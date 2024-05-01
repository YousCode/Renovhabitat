import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import API from "src/services/api";

export const ExplorerDetail = () => {
  const { t } = useTranslation();

  const [values, setValues] = useState({
    description: "",
    budget: "",
  });

  const requestFreelancer = async (e) => {
    e.preventDefault();
    const {data, ok} = await API.post("/freelance_request", values);
    if (ok) {
      setValues({ description: "", budget: "" });
      toast.success(t("freelance.request_success"));
    } else {
      toast.error(t("freelance.request_error"));
    }
  };

  return (
    <section className="lg:h-[calc(100vh-82px)] h-[calc(100vh-68px)] absolute lg:top-20 top-[68px] left-0 w-full lg:grid grid-cols-12">
      <div className="lg:col-span-3 3xl:col-span-4 h-1/4 lg:h-auto overflow-y-hidden">
        <img
          src={require("src/assets/explore-freelance.jpg")}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="lg:col-span-9 3xl:col-span-8 flex flex-col items-center justify-center lg:max-w-2xl lg:mx-auto m-5  gap-y-10">
        <div className="space-y-2">
          <h1 className="text-center text-gradient font-bold md:text-4xl text-3xl">
          {t("freelance2.line1")}  <br />  {t("freelance2.line2")}
          </h1>
          <p className="text-details-link">
          {t("freelance2.line3")} 
          </p>
        </div>

        <form className="w-full space-y-2" onSubmit={requestFreelancer}>
          <div className="space-y-1 w-full flex flex-col">
            <label className="font-semibold text-details-link">
              {t("freelance2.description")} 
            </label>
            <textarea
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
              rows={3}
              className="p-2.5 border-none rounded w-full bg-app-card-secondary text-white placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent ring-details-secondary transition-colors"
            />
          </div>
          <div className="space-y-1 w-full flex flex-col">
            <label className="font-semibold text-details-link">
            {t("freelance2.budget")} 
              
            </label>
            <input
              value={values.budget}
              onChange={(e) => setValues({ ...values, budget: e.target.value })}
              type="number"
              className="p-2.5 border-none rounded w-full bg-app-card-secondary text-white placeholder:text-details-secondary/50 focus:outline-0 ring-1 ring-transparent ring-details-secondary transition-colors"
            />
          </div>
          <button
            className="text-white py-2 text-center w-full bg-orange-pink font-semibold rounded-lg cursor-pointer block lg:!mt-10 mt-5"
            type="submit"
          >
            {t("freelance2.send")} 
          </button>
        </form>
      </div>
    </section>
  );
};