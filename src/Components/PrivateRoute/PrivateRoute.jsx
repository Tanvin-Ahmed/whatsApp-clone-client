import React, { useContext } from "react";
import { Route, Redirect } from "react-router";
import { infoContext } from "../../App";

const PrivateRoute = ({ children, ...rest }) => {
  const {loggedInUser} = useContext(infoContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
      loggedInUser.email ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
