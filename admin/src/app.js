import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import * as Sentry from "@sentry/browser";

import Loader from "./components/loader";
import Drawer from "./components/drawer";
import Header from "./components/header";

import Auth from "./scenes/auth";
import Home from "./scenes/home";
import Workspace from "./scenes/workspace";
import User from "./scenes/user";
import Administration from "./scenes/administration";
import Account from "./scenes/account";

import api from "./services/api";
import { setUser } from "./redux/auth/actions";

import { SENTRY_URL } from "./config";

import "./index.css";

if (process.env.NODE_ENV === "production" && SENTRY_URL) Sentry.init({ dsn: SENTRY_URL, environment: "app" });

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/admin/signin_token");
        if (!res.ok || !res.user) return setLoading(false);
        if (res.token) api.setToken(res.token);
        dispatch(setUser(res.user));
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
      {user && <Header />}

      <div className="flex flex-col md:flex-row h-app">
        {user && <Drawer />}
        <main className="flex-1">
          <Switch>
            <Route path="/auth" component={Auth} />
            <RestrictedRoute path="/account" component={Account} />
            <RestrictedRoute path="/workspace" component={Workspace} />
            <RestrictedRoute path="/user" component={User} />
            <RestrictedRoute path="/administration" component={Administration} />
            <RestrictedRoute path="/" component={Home} exact />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

const RestrictedRoute = ({ component: Component, role, ...rest }) => {
  const user = useSelector((state) => state.Auth.user);

  if (!user) return <Redirect to={{ pathname: "/auth" }} />;

  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to={{ pathname: "/auth" }} />)} />;
};

export default App;
