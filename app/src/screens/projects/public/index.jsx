import { Switch, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { hotjar } from "react-hotjar";

import { WelcomeProject } from "./welcome";
import { ProjectPublicDetail } from "./project";

export const ProjectPublic = () => {
  const location = useLocation();

  useEffect(() => {
    if (hotjar.initialized()) {
      hotjar.stateChange(location);
    }
  }, [location]);

  return (
    <Switch>
      <Route
        path="/public/project/:id/welcome"
        component={WelcomeProject}
        exact
      />
      <Route path="/public/project/:id" component={ProjectPublicDetail} exact />
    </Switch>
  );
};
