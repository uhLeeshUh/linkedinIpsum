import React from "react";
import { Route, Switch } from "react-router-dom";
import Form from "./form";
import Main from "./main";

export default (
  <Main>
    <Switch>
      <Route exact path="/form" component={Form} />
    </Switch>
  </Main>
);
