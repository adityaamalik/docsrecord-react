import { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";

import routes from "./config";
import GlobalStyles from "../globalStyles";

const Router = () => {
  return (
    <Suspense fallback={null}>
      <GlobalStyles />

      {window.location.pathname !== "/" &&
        window.location.pathname !== "/landing" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/printbill" &&
        window.location.pathname !== "/printprescription" && <Header />}

      <Switch>
        {routes.map((routeItem) => {
          return (
            <Route
              key={routeItem.component}
              path={routeItem.path}
              exact={routeItem.exact}
              component={lazy(() => import(`../pages/${routeItem.component}`))}
            />
          );
        })}
      </Switch>
      {window.location.pathname !== "/" &&
        window.location.pathname !== "/landing" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/printbill" &&
        window.location.pathname !== "/printprescription" && <Footer />}
    </Suspense>
  );
};

export default Router;
