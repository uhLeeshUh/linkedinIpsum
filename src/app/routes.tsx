import React from "react";
import { Route, Switch } from "react-router-dom";
import Form from "./form";
import Main from "./main";
import Bio from "./bio";
import LandingPage from "./landing-page";

export default (
  <Main>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/form" component={Form} />
      <Route exact path="/bio/:bioId" component={Bio} />
    </Switch>
  </Main>
);
