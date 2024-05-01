import { Switch, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ExplorerView } from "./view";
import { ExplorerDetail } from "./detail";


import { hotjar } from "react-hotjar";

export const Explorer = () => {
  const location = useLocation();

  useEffect(()=>{
    if (hotjar.initialized()) {
      hotjar.stateChange(location);
    }
  },[location]);

  return (
    <Switch>
      <Route path="/explorer/detail" component={ExplorerDetail} />
      <Route path="/explorer" component={ExplorerView} />
    </Switch>
  );
};