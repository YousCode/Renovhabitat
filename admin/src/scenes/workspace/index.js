import React from "react";
import { Route, Switch } from "react-router-dom";

import List from "./list";
import View from "./view";

export default function Index() {
  return (
    <div className="p-6">
      <Switch>
        <Route path="/workspace/:id" component={View} />
        <Route path="/workspace" component={List} />
      </Switch>
    </div>
  );
}
