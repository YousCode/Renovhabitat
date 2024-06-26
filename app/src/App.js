import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { hotjar } from "react-hotjar";
import * as Sentry from "@sentry/browser";

import { Layout } from "src/components/layout";
import { Dashboard, Projects, Equipe, Explorer, Auth, Connect } from "src/screens";
import Loader from "./components/loader";
import Account from "./screens/account";
import { ResponsiveIndicator } from "./components/layout/responsiveIndicator";

import api from "./services/api";
import { setUser } from "./redux/auth/actions";
import { hjid, hjsv } from "./config";
import { ProjectPublic } from "./screens/projects/public";

import DateDetails from "./components/DateDetails";
// import SaleDetails from "./components/SaleDetails";

import { environment, SENTRY_URL } from "./config";
import EditSale from "./components/EditSale";
import SeachClient from "./screens/ventes/SearchClients";
import AllSales from "./screens/ventes/AllSales";
import StatisticsDashboard from "./screens/statistiques/StatisticsDashboard";

if (environment === "production" && SENTRY_URL) Sentry.init({ dsn: SENTRY_URL, environment: "app" });

hotjar.initialize(hjid, hjsv);

export default function App() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/user/signin_token");
        if (!res.ok || !res.user) return setLoading(false);
        if (res.token) api.setToken(res.token);
        dispatch(setUser(res.user));
        i18n.changeLanguage(res.user.language);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/connect" component={Connect} />
        <Route path="/public/project" component={ProjectPublic} />
        <Route path="/projects/:date" component={DateDetails} />
        <Route path="/sales/edit/:saleId" component={EditSale} />
        <Route path="/ventes" component={SeachClient} />
        <Route path="/all-sales" component={AllSales} />
        <Route path="/statistiques" component={StatisticsDashboard} />

        <Layout>
          <Route path="/account" component={Account} />
          {/* <Route path="/projects" component={Projects} /> */}
          <Route path="/equipe" component={Equipe} />
          <Route path="/explorer" component={Explorer} />
          <Route path="/" component={Dashboard} exact />
        </Layout>
      </Switch>
      <ResponsiveIndicator />
    </Router>
  );
}