import React from "react";
import { Route, Switch } from "react-router-dom";

import Reset from "./reset";
import Forgot from "./forgot";
import Signin from "./signin";

const Auth = () => {
  return (
    <Switch>
      <Route path="/auth/reset" component={Reset} />
      <Route path="/auth/forgot" component={Forgot} />
      <Route path="/auth" component={Signin} />
    </Switch>
  );
};

export default Auth;
