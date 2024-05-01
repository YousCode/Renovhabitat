import { Switch, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { hotjar } from "react-hotjar";

import { ProjectDetail } from "./detail";
import { ProjectList } from "./list";

export const Projects = () => {
  const location = useLocation();

  useEffect(() => {
    if (hotjar.initialized()) {
      hotjar.stateChange(location);
    }
  }, [location]);

  return (
    <Switch>
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/projects" component={ProjectList} exact />
    </Switch>
  );
};
