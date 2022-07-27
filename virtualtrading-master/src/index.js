import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import App from "./App";
import Register from "./com/Register";
import Login from "./com/Login";

import Dashboard from "./com/dashboard/Dashboard";
import ScrollToTop from "./ScrollToTop";

import Products from "./com/dashboard/woo";

const public_routes = (
  <Router>
    <ScrollToTop>
      <Switch>
        <Route exact path="/products" component={Products} />
        <Route exact path="/" component={App} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </ScrollToTop>
  </Router>
);

ReactDOM.render(public_routes, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
