import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginView from "./modules/user/LoginView";
import RegisterView from "./modules/user/RegisterView";
import MeView from "./modules/user/MeView";
import SubscribeUser from "./modules/account/SubscribeUser";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={LoginView} />
      <Route path="/register" component={RegisterView} />
      <Route path="/me" component={MeView} />
      <Route path="/subscription" component={SubscribeUser} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
