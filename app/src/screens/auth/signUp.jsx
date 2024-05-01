import { useState, Fragment, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import api from "src/services/api";
import { setUser } from "src/redux/auth/actions";

export const SignUp = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", email: "", phone: "" });
  const [workspace, setWorkspace] = useState(null);
  const [created, setCreated] = useState(false);

  const { workspaceId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!workspaceId) return console.log("no workspace id");
        const { data } = await api.get(`/workspace/${workspaceId}`);
        setWorkspace(data);
        setValues({ ...values, workspace_name: data.name });
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const urlParams = new URLSearchParams(window.location.search);
      const invitationToken = urlParams.get("token");
      const workspace_id = urlParams.get("workspace_id");

      try {
        const { user: u, code } = await api.post(`/user/invitation_verify`, {
          token: invitationToken,
          workspace_id,
        });

        setValues(u);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (workspace) {
        values.workspace_name = workspace.name;
        values.workspace_id = workspace._id;
        values.status = "ACCEPTED";
      }
      const { user: u, token } = await api.post("/user/signup", values);
      api.setToken(token);
      dispatch(setUser(u));
      toast.success(t("signup.success"));
      if (!workspace) setCreated(true);
    } catch (e) {
      console.log(e);
    }
    console.log(values);
  };

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="max-w-sm mx-auto text-white py-12 flex items-center flex-col gap-y-12">
      <img src={require("src/assets/kolab-logo-lg.png")} alt="Kolab Logo" />
      {created ? (
        <p className="text-sm text-center">Account request submitted</p>
      ) : (
        <div className="space-y-8">
          <div className="text-center text-white space-y-4">
            <h1 className="text-2xl font-bold">{t("signup.create")}</h1>
            <p className="text-sm">
              {t("signup.invitation")}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              value={values.workspace_name || ""}
              name="workspace_name"
              disabled={workspaceId}
              placeholder={t("signup.workspace")}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              onChange={handleInputChange}
              required
            />
            <input
              placeholder={t("name")}
              name="name"
              aria-label={t("name")}
              value={values.name || ""}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={values.email || ""}
              aria-label="Email"
              onChange={handleInputChange}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              required
            />
            <input
              type="number"
              placeholder={t("phone")}
              name="phone"
              min={0}
              aria-label={t("phone")}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              onChange={handleInputChange}
              // required
            />
            <input
              type="password"
              placeholder={t("auth.password")}
              name="password"
              aria-label={t("auth.password")}
              className="bg-app-card-secondary border-transparent rounded w-full text-sm placeholder:text-details-secondary/80 text-white placeholder:text-details-secondary py-3 px-4"
              onChange={handleInputChange}
              required
            />
            <label className="text-sm text-details-link inline-block">
              <input
                type="checkbox"
                name="terms"
                aria-label={t("signup.accept_terms")}
                className="h-3 w-3 rounded-sm border border-details-link bg-transparent !ring-0 !outline-0 text-details-link mr-3"
                onChange={handleInputChange}
                required
              />
              <a 
                href="https://kolab.app/cgu/CGU.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline"
                onClick={(e) => e.stopPropagation()}
              >
               {t("signup.accept_terms")}
              </a>
            </label>
            <button
              type="submit"
              className="py-2 w-full text-center rounded-sm text-white bg-btn-gradient font-bold !mt-8 disabled:opacity-50 transition-opacity"
            >
             {t("signup.create_my_account")} 
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
